
import { useLoading } from '../hooks/UseLoading';

export default function LoadingOverlay() {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-100 bg-text-primary/40 flex items-center justify-center">
            <div className="bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb] px-10 py-8 flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-10 h-10 border-4 border-border-lighter border-t-accent rounded-full animate-spin" />
                <p className="text-base font-bold text-text-primary">Processing...</p>
            </div>
        </div>
    );
}