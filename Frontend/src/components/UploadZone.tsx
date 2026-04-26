import { useRef, memo } from 'react';
import { UploadCloud } from 'lucide-react';
import FormatBadge from './FormatBadge';

const ACCEPTED_FORMATS = [
    { label: 'PDF', icon: '📄' },
    { label: 'JPG', icon: '🖼' },
    { label: 'PNG', icon: '🖼' },
];

const MAX_FILE_SIZE_MB = 10;

interface UploadZoneProps {
    file: File | null;
    isDragging: boolean;
    onFileSelect: (file: File) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

function UploadZone({
    file,
    isDragging,
    onFileSelect,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
}: UploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBrowse = () => inputRef.current?.click();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) onFileSelect(selected);
    };

    return (
        <div
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-sm px-10 py-14 text-center mb-6 transition-colors
        ${isDragging ? 'bg-mode-active-bg border-border-strong' : 'bg-upload-bg border-border-mid'}
        ${file ? 'border-solid border-border-strong' : ''}`}
        >
            {/* inner dashed border */}
            <div className="absolute inset-1.5 border border-dashed border-border-lighter rounded-sm pointer-events-none" />

            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleInputChange}
            />

            <UploadCloud size={52} strokeWidth={1.5} className="mx-auto mb-4 text-text-primary" />

            {file ? (
                <>
                    <p className="text-xl font-black text-text-primary mb-1">{file.name}</p>
                    <p className="text-base text-text-muted-3 mb-6">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </>
            ) : (
                <>
                    <p className="text-xl font-black text-text-primary mb-1">Drag &amp; Drop your document here</p>
                    <p className="text-base text-text-muted-3 mb-6">or click to browse from your device</p>
                </>
            )}

            <button
                onClick={handleBrowse}
                className="px-8 py-2 text-lg font-semibold bg-btn-primary text-white border-2 border-btn-primary shadow-[4px_4px_0_#555] mb-6 cursor-pointer"
            >
                {file ? 'Replace File' : 'Browse Files'}
            </button>

            <div className="flex flex-wrap justify-center gap-2">
                {ACCEPTED_FORMATS.map((f) => (
                    <FormatBadge key={f.label} label={f.label} icon={f.icon} />
                ))}
                <span className="text-sm px-3 py-0.5 border border-border-light text-text-muted-3 bg-paper">
                    Max {MAX_FILE_SIZE_MB}MB
                </span>
            </div>
        </div>
    );
}

export default memo(UploadZone);