import { CheckSquare, Square, AlertTriangle } from 'lucide-react';
import type { StepStatus } from '../types/step';

interface AnalysisStepProps {
    label: string;
    status: StepStatus;
}

export default function AnalysisStep({ label, status }: AnalysisStepProps) {
    const icon = {
        done: <CheckSquare size={18} className="text-status-online" />,
        error: <AlertTriangle size={18} className="text-accent" />,
        active: <Square size={18} className="text-text-muted-3" />,
        pending: <Square size={18} className="text-text-muted-3" />,
    }[status];

    const labelColor = {
        done: 'text-text-primary',
        error: 'text-accent',
        active: 'text-text-primary',
        pending: 'text-text-muted-3',
    }[status];

    return (
        <div className="flex items-center gap-4 px-6 py-4">
            {icon}
            <div className="flex-1">
                <p className={`text-sm font-semibold ${labelColor}`}>{label}</p>
                {status === 'active' && (
                    <div className="mt-1.5 h-0.5 w-full bg-border-lighter overflow-hidden">
                        <div className="h-full bg-btn-primary animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '40%' }} />
                    </div>
                )}
            </div>
            {status === 'active' && (
                <div className="w-3 h-3 border-2 border-border-lighter border-t-btn-primary rounded-full animate-spin shrink-0" />
            )}
        </div>
    );
}