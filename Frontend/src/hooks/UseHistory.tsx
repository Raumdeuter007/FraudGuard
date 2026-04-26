import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContextDef';
import { useLoading } from '../hooks/UseLoading';
import { deleteFile, fetchFiles, type HistoryFile } from '../services/HistoryService';

export default function useHistory() {
    const { token } = useAuthContext();
    const { setLoading } = useLoading();
    const [files, setFiles] = useState<HistoryFile[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadFiles = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchFiles(token);
            setFiles(data.files);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load files');
        } finally {
            setLoading(false);
        }
    }, [token, setLoading]);

    const handleDelete = useCallback(async (id: string) => {
        if (!token) return;
        // TODO: optimistic update when endpoint is ready
        await deleteFile(token, id);
    }, [token]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return { files, error, handleDelete };
}