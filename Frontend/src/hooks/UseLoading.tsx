import { useContext } from 'react';
import { LoadingContext } from '../context/LoadingContextDef';

export function useLoading() {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
    return ctx;
}