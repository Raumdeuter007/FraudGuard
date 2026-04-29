import { apiFetch } from './ApiClient';

export interface ScanResult {
    id: string;
    scan_type: string;
    status: string;
    heatmap_url: string;
    tamper_percent: number;
    is_tampered: boolean;
    forgery_confidence: number | null;
    is_forged: boolean | null;
    started_at: string;
    completed_at: string;
}

export interface FileResult {
    id: string;
    url: string;
    mime_type: string;
    name: string;
    size_bytes: number;
    upload_status: string;
    created_at: string;
    scan: ScanResult | null;
}

export async function fetchFileById(id: string): Promise<FileResult> {
    const res = await apiFetch(`/files/${id}`);
    if (!res.ok) throw new Error('Failed to fetch result');
    return res.json();
}