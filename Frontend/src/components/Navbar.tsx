import { ShieldCheck, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContextDef';
import useAuth from '../hooks/UseAuth';

export default function Navbar() {
    const { token, user } = useAuthContext();
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-navbar-bg border-b-2 border-border-strong">
            {/* Main row */}
            <div className="flex items-center justify-between px-7 py-3.5">

                {/* Left: Logo + nav links when logged in */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 font-black text-2xl text-text-primary no-underline">
                        <ShieldCheck size={22} strokeWidth={2.5} />
                        Fraud<span className="text-accent">Guard</span>
                    </Link>

                    {token && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/upload" className="text-base font-semibold text-text-primary hover:text-accent transition-colors">
                                Upload
                            </Link>
                            <Link to="/history" className="text-base font-semibold text-text-primary hover:text-accent transition-colors">
                                History
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    {token ? (
                        <>
                            {/* Profile — desktop */}
                            <div
                                className="relative hidden md:block"
                                onClick={() => setProfileOpen((prev) => !prev)}
                            >
                                <button className="flex items-center gap-2 px-4 py-1.5 border-2 border-border-strong text-text-primary cursor-pointer">
                                    <User size={16} strokeWidth={2} />
                                    <span className="text-base font-semibold">Welcome, {user?.name ?? 'User'}</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-full bg-paper border-2 border-border-strong shadow-[3px_3px_0_#555] z-50">
                                        <button
                                            onClick={logout}
                                            className="w-full px-4 py-2 text-sm font-semibold text-accent hover:bg-upload-bg text-left cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="font-medium text-base px-4 py-1 border-2 border-border-strong text-text-primary no-underline"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="font-medium text-base px-4 py-1 border-2 border-border-strong bg-btn-primary text-white shadow-[3px_3px_0_#555] no-underline"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Hamburger — mobile only */}
                    <button
                        className="md:hidden cursor-pointer text-text-primary"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="md:hidden border-t-2 border-border-strong bg-paper px-7 py-4 flex flex-col gap-4">
                    {token ? (
                        <>
                            <Link to="/upload" className="text-base font-semibold text-text-primary" onClick={() => setMenuOpen(false)}>
                                Upload
                            </Link>
                            <Link to="/history" className="text-base font-semibold text-text-primary" onClick={() => setMenuOpen(false)}>
                                History
                            </Link>
                            <div className="border-t border-border-lighter pt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-text-muted-2">
                                    <User size={15} />
                                    {user?.email ?? 'User'}
                                </div>
                                <button onClick={logout} className="text-sm font-semibold text-accent cursor-pointer">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-base font-semibold text-text-primary" onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="text-base font-semibold text-text-primary" onClick={() => setMenuOpen(false)}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}