import { useNavigate, Link } from 'react-router-dom';
import { Zap, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function PublicHeader() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-all duration-300">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-slate-900">
                        Trade Adhyayan
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <HeaderLink label="Features" href="/#features" />
                    <HeaderLink label="Pricing" href="/pricing" />
                    <HeaderLink label="Strategies" href="/strategies" />
                    <HeaderLink label="Community" href="/community" />

                    {user ? (
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
                        >
                            <LayoutDashboard size={14} />
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-[10px] font-bold uppercase text-slate-500 hover:text-indigo-600 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                to="/login"
                                state={{ defaultSignUp: true }}
                                className="px-8 py-3.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

function HeaderLink({ label, href }: { label: string; href: string }) {
    return (
        <Link
            to={href}
            className="text-[10px] font-bold uppercase  text-slate-500 hover:text-indigo-600 transition-colors"
        >
            {label}
        </Link>
    );
}
