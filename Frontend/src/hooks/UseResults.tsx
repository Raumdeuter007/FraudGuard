import { useState, useEffect } from 'react';
import { fetchFileById, type FileResult } from '../services/ResultsService';
import { useLoading } from './UseLoading';

export default function useResults(id: string | undefined) {
    const { setLoading } = useLoading();
    const [result, setResult] = useState<FileResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchFileById(id);
                setResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load result');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, setLoading]);

    return { result, error };
}