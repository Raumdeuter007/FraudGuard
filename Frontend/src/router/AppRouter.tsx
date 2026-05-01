import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomeRedirect from './HomeRedirect';
import {
    LoginPage, RegisterPage,
    UploadPage, HistoryPage,
    AnalyzingPage, ResultsPage,
    NotFoundPage
} from '../pages';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/analyzing" element={<AnalyzingPage />} />
                <Route path="/results/:id" element={<ResultsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}