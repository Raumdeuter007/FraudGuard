import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContextDef';

export default function ProtectedRoute() {
    const { token } = useAuthContext();
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}