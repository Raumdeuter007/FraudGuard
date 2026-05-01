interface ConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-text-primary/40">
            <div className="bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb] px-8 py-6 max-w-sm w-full mx-4">
                <p className="text-base font-bold text-text-primary mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-sm font-bold border-2 border-border-strong bg-transparent text-text-primary cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 text-sm font-bold border-2 border-accent bg-accent text-white shadow-[3px_3px_0_#7a1a10] cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}