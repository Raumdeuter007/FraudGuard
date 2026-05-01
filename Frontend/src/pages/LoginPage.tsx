import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/UseAuth';

export default function LoginForm() {
    const { login, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!username || !password) return;
        await login({ username, password });
    };

    return (
        <div className="flex items-center justify-center px-4 py-8">
            <div className="bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd] w-full max-w-md">
                <div className="px-8 py-6 border-b-2 border-border-strong bg-navbar-bg">
                    <h1 className="text-2xl font-black text-text-primary">Sign In</h1>
                    <p className="text-sm text-text-muted-3 mt-1">Access your FraudGuard account</p>
                </div>

                <div className="px-8 py-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-primary">Email</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        className="mt-1 px-10 py-2.5 text-lg font-black text-white bg-accent border-2 border-accent shadow-[5px_5px_0_#7a1a10] cursor-pointer
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        Sign In →
                    </button>

                    <p className="text-sm text-text-muted-3 text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-text-primary underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}