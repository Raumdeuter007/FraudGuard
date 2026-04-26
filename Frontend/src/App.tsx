import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute';
import { LoadingProvider } from './context/LoadingContext'
import LoadingOverlay from './components/LoadingOverlay';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import Navbar from './components/Navbar';
import HistoryPage from './pages/HistoryPage';

export default function App() {
	return (
		<BrowserRouter>
			<LoadingProvider>
				<AuthProvider>
					<div className="min-h-screen bg-page-bg" style={{
						backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, #d4cfc4 28px),
                    repeating-linear-gradient(90deg, transparent, transparent 27px, #d4cfc4 28px)`,
						backgroundSize: '28px 28px',
					}}>
						<LoadingOverlay />
						<Navbar />

						<Routes>
							<Route path="/login" element={<LoginPage />} />

							<Route element={<ProtectedRoute />}>
								<Route path="/upload" element={<UploadPage />} />
								<Route path="/history" element={<HistoryPage />} />
							</Route>

							<Route path="*" element={<Navigate to="/login" replace />} />
						</Routes>
					</div>
				</AuthProvider>
			</LoadingProvider>
		</BrowserRouter >
	);
}