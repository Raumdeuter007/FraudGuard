import { useToast } from '../context/ToastContext';
import type { Toast } from '../types/toast';

const STYLES: Record<Toast['type'], string> = {
    success: 'border-status-online text-status-online',
    error: 'border-accent text-accent',
    info: 'border-border-strong text-text-primary',
};

const ICONS: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    info: 'i',
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-200 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 bg-paper border-2 px-4 py-3 shadow-[3px_3px_0_#555] min-w-64 max-w-sm ${STYLES[toast.type]}`}
                >
                    <span className="font-black text-sm w-4 text-center">{ICONS[toast.type]}</span>
                    <p className="text-sm font-semibold text-text-primary flex-1">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-text-muted-3 hover:text-text-primary cursor-pointer text-base leading-none"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}