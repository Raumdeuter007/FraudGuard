import io
import logging
import numpy as np
import cv2
import torch
import albumentations as albu
from albumentations.pytorch import ToTensorV2
from PIL import Image
 
logger = logging.getLogger(__name__)
 
 
def get_inference_transform(output_size: int):
    return albu.Compose([
        albu.PadIfNeeded(
            min_height=output_size,
            min_width=output_size,
            border_mode=0,
            position="top_left",
        ),
        albu.Normalize(
            mean=(0.485, 0.456, 0.406),  
            std=(0.229, 0.224, 0.225), 
        ),
#       albu.Crop(x_min=0, y_min=0, x_max=output_size, y_max=output_size),
        ToTensorV2(),
    ])
 
 
class TamperingDetector:
    """
    Loads IML-ViT once at startup and exposes a single predict() method.
    """
 
    def __init__(self, ckpt_path: str, output_size: int = 1024):
        self.output_size = output_size
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"TamperingDetector using device: {self.device}")
 
        # Import here so FastAPI can start even if ML deps are missing in dev
        from models.iml_vit_model import iml_vit_model  # noqa: PLC0415
 
        model = iml_vit_model()
        checkpoint = torch.load(ckpt_path, map_location=self.device)
 
        # Official checkpoint: state_dict at top level
        # Custom checkpoint: state_dict under 'model' key
        if isinstance(checkpoint, dict) and "model" in checkpoint:
            state_dict = checkpoint["model"]
        else:
            state_dict = checkpoint
 
        model.load_state_dict(state_dict, strict=True)
        model.to(self.device)
        model.eval()
        self.model = model
 
        self.transform = get_inference_transform(output_size)
        logger.info("IML-ViT loaded successfully.")
 
    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
 
    def _decode_image(self, image_bytes: bytes) -> np.ndarray:
        """Decode raw bytes to an RGB uint8 numpy array (H x W x 3)."""
        nparr = np.frombuffer(image_bytes, dtype=np.uint8)
        bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if bgr is None:
            raise ValueError("Could not decode image bytes — unsupported format or corrupt file.")
        return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
 
    def _resize_to_fit(self, image: np.ndarray) -> np.ndarray:
        """
        Downscale if either dimension exceeds output_size, preserving aspect ratio.
        PadIfNeeded handles images smaller than output_size, but Crop would
        silently truncate anything larger — so we must resize first.
        """
        h, w = image.shape[:2]
        if h > self.output_size or w > self.output_size:
            scale = self.output_size / max(h, w)
            new_w = max(1, int(w * scale))
            new_h = max(1, int(h * scale))
            image = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
            logger.debug(f"Resized from ({h},{w}) to ({new_h},{new_w})")
        return image
 
    def _preprocess(self, image: np.ndarray):
        """
        Returns:
            tensor : torch.Tensor  shape (1, 3, output_size, output_size)
            orig_h : int  height after optional resize (before padding)
            orig_w : int  width  after optional resize (before padding)
        """
        image = self._resize_to_fit(image)
        orig_h, orig_w = image.shape[:2]
 
        result = self.transform(image=image)
        tensor = result["image"].unsqueeze(0).float()  # (1, 3, H, W)
        return tensor, orig_h, orig_w
 
    def _build_overlay(
        self,
        original_rgb: np.ndarray,
        mask: np.ndarray,
        alpha_image: float = 0.6,
        alpha_heatmap: float = 0.4,
    ) -> np.ndarray:
        """
        Blend original image with JET heatmap.
        Both inputs must have the same spatial dimensions.
        Returns BGR uint8 (suitable for cv2.imencode).
        """
        mask_uint8 = (mask * 255).astype(np.uint8)
        heatmap_bgr = cv2.applyColorMap(mask_uint8, cv2.COLORMAP_JET)
        original_bgr = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(original_bgr, alpha_image, heatmap_bgr, alpha_heatmap, 0)
        return overlay
 
    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
 
    def predict(self, image_bytes: bytes) -> dict:
        """
        Run tampering detection on raw image bytes.
 
        Returns a dict with:
            - 'mask'    : np.ndarray float32 (H x W), values in [0, 1]
            - 'overlay' : np.ndarray uint8   (H x W x 3) BGR, heatmap blended
            - 'orig_h'  : int
            - 'orig_w'  : int
        """
        # 1. Decode
        rgb = self._decode_image(image_bytes)
 
        # 2. Preprocess (resize-to-fit + pad + normalise + crop + to tensor)
        tensor, orig_h, orig_w = self._preprocess(rgb)
        tensor = tensor.to(self.device)
 
        # 3. Dummy tensors for gt and edge_mask (required by model signature)
        #    Shape must match the padded tensor spatial dims: (1, 1, H, W)
        _, _, H, W = tensor.shape
        dummy = torch.zeros(1, 1, H, W, device=self.device)
 
        # 4. Inference
        with torch.no_grad():
            _, mask_pred, _ = self.model(tensor, dummy, dummy)
        # mask_pred shape: (1, 1, output_size, output_size), sigmoid applied internally
 
        # 5. Crop back to pre-padding dimensions
        mask = mask_pred[0, 0, :orig_h, :orig_w].cpu().numpy()  # (orig_h, orig_w)
 
        # 6. Resize original rgb to match (it was resized in _resize_to_fit)
        resized_rgb = cv2.resize(
            cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR),
            (orig_w, orig_h),
            interpolation=cv2.INTER_AREA,
        )
        resized_rgb = cv2.cvtColor(resized_rgb, cv2.COLOR_BGR2RGB)
 
        # 7. Build overlay
        overlay = self._build_overlay(resized_rgb, mask)
 
        return {
            "mask": mask,
            "overlay": overlay,
            "orig_h": orig_h,
            "orig_w": orig_w,
            "score": float(mask.max()),
            "mean_score": float(mask.mean()),
        }
 
    def predict_and_encode(self, image_bytes: bytes) -> tuple[bytes, bytes, float, float]:
        """
        Convenience wrapper that returns (mask_png_bytes, overlay_png_bytes).
        Suitable for direct HTTP response or ImageKit upload.
        """
        result = self.predict(image_bytes)
 
        mask_uint8 = (result["mask"] * 255).astype(np.uint8)
        _, mask_buf = cv2.imencode(".png", mask_uint8)
 
        _, overlay_buf = cv2.imencode(".png", result["overlay"])
 
        return mask_buf.tobytes(), overlay_buf.tobytes(), result['score'], result['mean_score']