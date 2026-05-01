import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import { LoadingProvider } from './context/LoadingContext'
import LoadingOverlay from './components/LoadingOverlay';
import Navbar from './components/Navbar';
import AppRouter from './router/AppRouter';
import { ToastProvider } from './context/ToastContextDef';
import ToastContainer from './components/ToastContainer';

export default function App() {
	return (
		<BrowserRouter>
			<LoadingProvider>
				<ToastProvider>
					<AuthProvider>
						<div className="min-h-screen bg-page-bg" style={{
							backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, #d4cfc4 28px),
                    repeating-linear-gradient(90deg, transparent, transparent 27px, #d4cfc4 28px)`,
							backgroundSize: '28px 28px',
						}}>
							<LoadingOverlay />
							<ToastContainer />
							<Navbar />
							<AppRouter />
						</div>
					</AuthProvider>
				</ToastProvider>
			</LoadingProvider>
		</BrowserRouter >
	);
}