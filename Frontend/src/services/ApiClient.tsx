const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = localStorage.getItem('token');

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return res;
}