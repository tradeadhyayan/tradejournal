import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AppShell() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-svh overflow-hidden bg-slate-50 text-indigo-950 transition-all duration-700 font-body">
            {/* Background Decorations */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 blur-[100px] rounded-full -z-10" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/20 blur-[100px] rounded-full -z-10" />

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Inset Main Viewport */}
            <main className="flex-1 overflow-y-auto ml-0 md:ml-84 md:mr-4 my-4 no-scrollbar bg-white/40 backdrop-blur-3xl border border-white rounded-[3rem] shadow-2xl shadow-indigo-200/20 transition-all duration-500 w-full relative group">
                {/* Fixed Top Bar Inside Main - Hidden on Analytics */}
                {location.pathname !== '/analytics' && (
                    <header className="sticky top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-b border-white z-30 flex items-center justify-between px-10 transition-all duration-300">
                        <div className="flex items-center gap-6">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm"
                            >
                                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest opacity-40">Trading Matrix Active</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                <button className="hover:text-indigo-600 transition-colors">Documentation</button>
                                <button className="hover:text-indigo-600 transition-colors">Support</button>
                            </div>
                        </div>
                    </header>
                )}

                <div className="max-w-[1400px] mx-auto p-8 md:p-14 pb-24 md:pb-14">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/10 z-30 md:hidden backdrop-blur-md transition-all animate-in fade-in duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
