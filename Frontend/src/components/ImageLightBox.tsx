import { useEffect, useState, useRef } from 'react';

interface ImageLightboxProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    const [scale, setScale] = useState(1);
    const [origin, setOrigin] = useState('center center');
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation();
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);

        setScale((prev) => {
            if (prev >= 3) return 1;
            return prev + 1;
        });
    };

    return (
        <div
            className="fixed inset-0 z-200 bg-text-primary/80 flex items-center justify-center overflow-hidden"
            onClick={onClose}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="max-w-[90vw] max-h-[90vh] object-contain border-2 border-border-strong transition-transform duration-300"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: origin,
                    cursor: scale >= 3 ? 'zoom-out' : 'zoom-in',
                }}
                onClick={handleImageClick}
            />
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white font-black text-2xl cursor-pointer z-10"
            >
                ✕
            </button>
        </div>
    );
}