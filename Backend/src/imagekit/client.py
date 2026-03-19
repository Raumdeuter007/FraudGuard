from imagekitio import ImageKit
from src.imagekit import config as imagekit_config

imageKit = ImageKit(
    private_key=imagekit_config.IMAGEKIT_PRIVATE_KEY,
)