const BASE_URL = import.meta.env.VITE_API_URL;
import type { LoginCredentials } from "../types/auth";

interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
    };
}

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
    const body = new URLSearchParams({
        grant_type: 'password',
        username: credentials.username,
        password: credentials.password,
        scope: '',
        client_id: '',
        client_secret: '',
    });

    const res = await fetch(`${BASE_URL}/auth/jwt/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? 'Login failed');
    }
    const data = await res.json();
    console.log('Login response:', data);
    return data;
}

export async function logoutRequest(token: string): Promise<void> {
    await fetch(`${BASE_URL}/auth/jwt/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
}