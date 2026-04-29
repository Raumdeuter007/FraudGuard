import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AnalysisStep from '../components/AnalysisStep';
import StatusBar from '../components/StatusBar';
import useAnalysis from '../hooks/UseAnalysis';
import { STEPS } from '../types/step';

interface AnalyzingState {
    file: File;
    name: string;
}

export default function AnalyzingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as AnalyzingState | null;

    useEffect(() => {
        if (!state?.file || !state?.name) navigate('/upload', { replace: true });
    }, [state, navigate]);

    const { stepStatuses, error } = useAnalysis(state?.file ?? null, state?.name ?? null);

    return (
        <div className="max-w-3xl mx-auto my-8 bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd]">
            <div className="px-10 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-text-primary mb-2">
                        {error ? 'Analysis Failed' : 'Analyzing Document....'}
                    </h1>
                    <p className="text-sm text-text-muted-3">
                        {error ? 'An error occurred during analysis.' : 'Please wait. Do not close or refresh this page.'}
                    </p>
                </div>

                <div className="flex items-center gap-4 border-2 border-border-strong px-5 py-3 mb-8 bg-upload-bg max-w-sm mx-auto">
                    <div className="w-10 h-10 border-2 border-border-strong flex items-center justify-center text-xs font-black text-text-muted-2 shrink-0">
                        {state?.file.type.includes('pdf') ? 'PDF' : 'IMG'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-text-primary truncate">{state?.name}</p>
                        <p className="text-xs text-text-muted-3">{state?.file.name}</p>
                    </div>
                </div>

                <div className="border-2 border-border-strong divide-y divide-border-lighter mb-8">
                    {STEPS.map((step) => (
                        <AnalysisStep key={step.key} label={step.label} status={stepStatuses[step.key]} />
                    ))}
                </div>

                {error && (
                    <div className="border-2 border-accent bg-paper px-6 py-4">
                        <p className="text-sm font-semibold text-accent mb-3">{error}</p>
                        <Link to="/upload" className="text-sm font-black text-text-primary underline">
                            ← Go back to Upload
                        </Link>
                    </div>
                )}
            </div>
            <StatusBar online={true} />
        </div>
    );
}