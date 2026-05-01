import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, logoutRequest } from '../services/AuthService';

import { useAuthContext } from '../context/AuthContextDef';
import type { LoginCredentials } from '../types/auth';
import { useLoading } from '../hooks/UseLoading';
import { useToast } from '../context/ToastContext';

export default function useAuth() {
    const { setLoading } = useLoading();
    const { token, user, setAuth, clearAuth } = useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const login = useCallback(async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginRequest(credentials);
            setAuth(data.access_token, { id: '', email: credentials.username });
            addToast('Welcome back!', 'success');
            navigate('/upload');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            addToast(err instanceof Error ? err.message : 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    }, [setAuth, navigate, setLoading, addToast]);

    const logout = useCallback(async () => {
        if (token) await logoutRequest(token);
        clearAuth();
        addToast('Signed out successfully.', 'success');
        navigate('/login');
    }, [token, clearAuth, navigate, addToast]);

    return { token, user, error, login, logout };
}