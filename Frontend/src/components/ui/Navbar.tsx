import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-7 py-3.5 bg-navbar-bg border-b-2 border-border-strong">
            <div className="flex items-center gap-2 font-black text-2xl text-text-primary">
                <ShieldCheck size={22} strokeWidth={2.5} />
                Fraud<span className="text-accent">Guard</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="font-medium text-lg px-4 py-1 border-2 border-border-strong bg-transparent text-text-primary cursor-pointer">
                    History
                </button>
                <button className="font-medium text-lg px-4 py-1 border-2 border-border-strong bg-transparent text-text-primary cursor-pointer">
                    Login
                </button>
                <button className="font-medium text-lg px-4 py-1 border-2 border-border-strong bg-btn-primary text-white shadow-[3px_3px_0_#555] cursor-pointer">
                    Register
                </button>
            </div>
        </nav>
    );
}