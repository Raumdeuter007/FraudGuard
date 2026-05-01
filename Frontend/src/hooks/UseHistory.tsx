import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContextDef';
import { useLoading } from '../hooks/UseLoading';
import { deleteFile, fetchFiles, type HistoryFile } from '../services/HistoryService';
import { useToast } from '../context/ToastContext';

export default function useHistory() {
    const { token } = useAuthContext();
    const { setLoading } = useLoading();
    const [files, setFiles] = useState<HistoryFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    const loadFiles = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchFiles();
            setFiles(data.files);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load files');
        } finally {
            setLoading(false);
        }
    }, [token, setLoading]);

    const handleDelete = useCallback(async (id: string) => {
        if (!token) return;
        setLoading(true);
        try {
            await deleteFile(id);
            setFiles((prev) => prev.filter((f) => f.id !== id));
            addToast('File deleted.', 'success');
        } catch {
            addToast('Failed to delete file.', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, addToast, setLoading]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return { files, error, handleDelete };
}