import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContextDef';

export default function HomeRedirect() {
    const { token } = useAuthContext();
    return token ? <Navigate to="/history" replace /> : <Navigate to="/login" replace />;
}