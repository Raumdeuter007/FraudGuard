import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, logoutRequest } from '../services/AuthService';

import { useAuthContext } from '../context/AuthContextDef';
import type { LoginCredentials } from '../types/auth';
import { useLoading } from '../hooks/UseLoading';

export default function useAuth() {
    const { setLoading } = useLoading();
    const { token, user, setAuth, clearAuth } = useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = useCallback(async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginRequest(credentials);
            setAuth(data.access_token, { id: '', email: credentials.username });
            navigate('/upload');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }, [setAuth, navigate, setLoading]);

    const logout = useCallback(async () => {
        if (token) await logoutRequest(token);
        clearAuth();
        navigate('/login');
    }, [token, clearAuth, navigate]);

    return { token, user, error, login, logout };
}