import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomeRedirect from './HomeRedirect';
import LoginPage from '../pages/LoginPage';
import UploadPage from '../pages/UploadPage';
import HistoryPage from '../pages/HistoryPage';
import NotFoundPage from '../pages/NotFoundPage';
import AnalyzingPage from '../pages/AnalyzingPage';
import ResultsPage from '../pages/ResultsPage';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
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