import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd] px-16 py-12 text-center max-w-md w-full">
                <p className="text-8xl font-black text-accent mb-2">404</p>
                <p className="text-xl font-black text-text-primary mb-2">Page Not Found</p>
                <p className="text-sm text-text-muted-3 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-2.5 text-base font-black text-white bg-btn-primary border-2 border-btn-primary shadow-[4px_4px_0_#555] cursor-pointer"
                >
                    Go Home →
                </button>
            </div>
        </div>
    );
}