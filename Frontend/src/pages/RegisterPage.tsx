import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../services/AuthService';
import { useLoading } from '../hooks/UseLoading';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!email || !name || !password) return;
        setLoading(true);
        setError(null);
        try {
            await registerRequest({ email, name, password });
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-6">
            <div className="bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd] w-full max-w-md">
                <div className="px-8 py-6 border-b-2 border-border-strong bg-navbar-bg">
                    <h1 className="text-2xl font-black text-text-primary">Create Account</h1>
                    <p className="text-sm text-text-muted-3 mt-1">Register to access FraudGuard</p>
                </div>

                <div className="px-8 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-primary">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="px-4 py-2.5 border-2 border-border-mid bg-upload-bg text-text-primary text-base outline-none focus:border-border-strong"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-primary">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="px-4 py-2.5 border-2 border-border-mid bg-upload-bg text-text-primary text-base outline-none focus:border-border-strong"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-primary">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="px-4 py-2.5 border-2 border-border-mid bg-upload-bg text-text-primary text-base outline-none focus:border-border-strong"
                        />
                    </div>

                    {error && <p className="text-accent text-sm">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        className="mt-2 px-10 py-2.5 text-lg font-black text-white bg-accent border-2 border-accent shadow-[5px_5px_0_#7a1a10] cursor-pointer
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        Create Account →
                    </button>

                    <p className="text-sm text-text-muted-3 text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-text-primary underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}