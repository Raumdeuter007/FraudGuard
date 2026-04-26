const BASE_URL = import.meta.env.VITE_API_URL;

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

export async function fetchFiles(token: string): Promise<FilesResponse> {
    console.log('Token being sent:', token);
    const res = await fetch(`${BASE_URL}/files/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
        },
    });

    if (!res.ok) throw new Error('Failed to fetch files');
    return res.json();
}

export async function deleteFile(token: string, id: string): Promise<void> {
    // TODO: wire to delete endpoint
    console.log('Delete:', id, token);
}