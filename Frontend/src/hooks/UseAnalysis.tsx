import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { STEPS, type StepStatus } from '../types/step';
import { uploadAndAnalyze } from '../services/UploadService';
import { useToast } from '../context/ToastContext';

const initialStatuses = (): Record<string, StepStatus> =>
    Object.fromEntries(STEPS.map((s, i) => [s.key, i === 0 ? 'active' : 'pending']));

export default function useAnalysis(file: File | null, name: string | null) {
    const navigate = useNavigate();
    const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(initialStatuses);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (!file || !name) return;

        const setStepDone = (key: string, nextKey?: string) => {
            setStepStatuses((prev) => ({
                ...prev,
                [key]: 'done',
                ...(nextKey ? { [nextKey]: 'active' } : {}),
            }));
        };

        const markCurrentAsError = () => {
            setStepStatuses((prev) => {
                const updated = { ...prev };
                for (const key of Object.keys(updated)) {
                    if (updated[key] === 'active') updated[key] = 'error';
                }
                return updated;
            });
        };

        const handleEvent = (data: Record<string, unknown>) => {
            switch (data.event) {
                case 'upload_complete': setStepDone('upload', 'inference'); break;
                case 'inference_complete': setStepDone('inference', 'overlay'); break;
                case 'overlay_complete': setStepDone('overlay', 'done'); break;
                case 'done':
                    setStepDone('done');
                    addToast('Analysis complete.', 'success');
                    setTimeout(() => navigate(`/results/${data.file_id}`), 800);
                    break;
                case 'error':
                    setError((data.detail as string) ?? 'An error occurred');
                    markCurrentAsError();
                    break;
            }
        };

        const run = async () => {
            const token = localStorage.getItem('token');
            abortRef.current = new AbortController();
            try {
                await uploadAndAnalyze(file, name, token!, abortRef.current.signal, handleEvent);
            } catch (err) {
                if ((err as Error).name === 'AbortError') return;
                setError(err instanceof Error ? err.message : 'Something went wrong');
                addToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
                markCurrentAsError();
            }
        };

        run();
        return () => abortRef.current?.abort();
    }, [file, name, navigate, addToast]);

    return { stepStatuses, error };
}