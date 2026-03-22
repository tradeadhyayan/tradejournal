import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    Users,
    Settings,
    LogOut,
    Target,
    Zap,
    ChevronRight,
    Brain,
    Shield,
    Calendar,
    Trophy,
    Rocket,
    GraduationCap,
    Wrench,
    Globe,
    BookOpen,
    Link
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, signOut } = useAuth();

    const menuItems = [
        {
            label: 'Main', items: [
                { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
                { icon: <Activity size={20} />, label: 'Journal', path: '/journal' },
                { icon: <Zap size={20} />, label: 'Analytics', path: '/analytics' },
                { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
            ]
        },
        {
            label: 'Performance', items: [
                { icon: <Shield size={20} />, label: 'Mistakes', path: '/mistakes' },
                { icon: <Target size={20} />, label: 'Rules', path: '/rules' },
                { icon: <Brain size={20} />, label: 'Strategies', path: '/strategies' },
            ]
        },
        {
            label: 'Academy', items: [
                { icon: <Users size={20} />, label: 'Mentorship', path: '/mentorship' },
                { icon: <BookOpen size={20} />, label: 'Mentor Guidance', path: '/mentor-guidance' },
                { icon: <GraduationCap size={20} />, label: 'Learn', path: '/learn' },
            ]
        },
        {
            label: 'Tools', items: [
                { icon: <Wrench size={20} />, label: 'Tools', path: '/tools' },
                { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
            ]
        },
        ...(profile?.role === 'ADMIN' ? [{
            label: 'Admin', items: [
                { icon: <Shield size={20} />, label: 'Dashboard', path: '/admin' },
            ]
        }] : [])
    ];

    return (
        <aside className={cn(
            "w-80 h-[calc(100vh-5rem)] bg-white/70 backdrop-blur-xl border-r border-slate-200/50 flex flex-col fixed left-0 top-20 z-40 overflow-y-auto no-scrollbar pb-4 transition-all duration-500 md:translate-x-0 font-body shadow-[20px_0_50px_rgba(0,0,0,0.02)]",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Header / Logo removed - handled by AppShell */}
            <div className="mt-8" />

            {/* Navigation */}
            <nav className="flex-1 px-5 space-y-8 mt-4">
                {menuItems.map((category) => (
                    <div key={category.label} className="space-y-4">
                        <p className="px-5 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] opacity-40">
                            {category.label}
                        </p>
                        <div className="space-y-1.5">
                            {category.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group relative leading-none",
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
                                                : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "transition-all duration-300",
                                                isActive ? "text-white scale-110" : "text-slate-400 group-hover:text-indigo-600 group-hover:scale-110"
                                            )}>
                                                {item.icon}
                                            </div>
                                            <span className="text-xs font-bold tracking-tight">{item.label}</span>
                                        </div>
                                        {isActive && (
                                            <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-[2px_0_10px_rgba(255,255,255,0.5)]" />
                                        )}
                                        {!isActive && (
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile / Status */}
            <div className="p-6 mt-auto">
                <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-[2.5rem] flex items-center gap-4 transition-all shadow-2xl group hover:scale-[1.02] cursor-pointer">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 overflow-hidden shrink-0 group-hover:rotate-12 transition-transform">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <Zap className="text-white fill-white" size={16} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-xs leading-tight truncate">{profile?.full_name?.split(' ')[0] || 'Trader'}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{profile?.plan || 'Free Member'}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            signOut();
                        }}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
