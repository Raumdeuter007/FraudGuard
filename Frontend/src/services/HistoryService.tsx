export interface HistoryFile {
    id: string;
    url: string;
    mime_type: string;
    name: string;
    created_at: string;
}

export interface FilesResponse {
    files: HistoryFile[];
}

import { apiFetch } from './ApiClient';

export async function fetchFiles(): Promise<FilesResponse> {
    const res = await apiFetch('/files/');
    if (!res.ok) throw new Error('Failed to fetch files');
    return res.json();
}

export async function deleteFile(id: string): Promise<void> {
    const res = await apiFetch(`/files/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete file');
}