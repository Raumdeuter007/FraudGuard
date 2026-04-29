const BASE_URL = import.meta.env.VITE_API_URL;

export async function uploadAndAnalyze(
    file: File,
    name: string,
    token: string,
    signal: AbortSignal,
    onEvent: (data: Record<string, unknown>) => void
): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/files/upload?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal,
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }
    if (!res.ok) throw new Error('Upload request failed');
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(Boolean);
        for (const line of lines) {
            try {
                if (!line.startsWith('data:')) continue;
                const cleaned = line.slice(5).trim();
                const parsed = JSON.parse(cleaned);
                // backend double-serializes: parsed is a string, parse again
                const event = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
                onEvent(event);
            } catch { /* skip malformed */ }
        }
    }
}