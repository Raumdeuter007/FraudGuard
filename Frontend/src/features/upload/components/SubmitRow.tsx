interface SubmitRowProps {
    disabled?: boolean;
    onSubmit: () => void;
}

export default function SubmitRow({ disabled = false, onSubmit }: SubmitRowProps) {
    return (
        <div className="flex items-center justify-between border-t border-dashed border-border-lighter pt-5 mt-2">
            <p className="text-sm text-text-muted-4">⚠ Max file size: 10MB</p>
            <button
                disabled={disabled}
                onClick={onSubmit}
                className="px-10 py-2.5 text-lg font-black text-white bg-accent border-2 border-accent shadow-[5px_5px_0_#7a1a10] cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Analyze Document →
            </button>
        </div>
    );
}