import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    Shield,
    Zap,
    Search,
    Download,
    Eye,
    ChevronRight,
    ArrowUpRight,
    Activity,
    CreditCard,
    Star,
    ShieldAlert,
    RefreshCw,
    MoreVertical
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { SubHeading } from '@/components/ui/SubHeading';

interface AdminStats {
    totalUsers: number;
    premiumUsers: number;
    totalTrades: number;
    totalVolume: number;
    recentSignups: number;
}

export default function Admin() {
    const { profile } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [trades, setTrades] = useState<any[]>([]);
    const [webinarRegistrations, setWebinarRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'trades' | 'webinar'>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const loadAdminData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [s, u, t, w] = await Promise.all([
                api.admin.getStats(),
                api.admin.listUsers(),
                api.admin.listAllTrades(),
                api.admin.listWebinarRegistrations()
            ]);
            setStats(s);
            setUsers(u || []);
            setTrades(t || []);
            setWebinarRegistrations(w || []);
        } catch (err: any) {
            console.error('Admin Load Error:', err);
            setError(err.message || 'Failed to load platform data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const togglePremium = async (userId: string, currentPlan: string) => {
        try {
            const nextPlan = currentPlan === 'PREMIUM' ? 'FREE' : 'PREMIUM';
            await api.users.updateProfile(userId, {
                plan: nextPlan,
                subscription_status: nextPlan === 'PREMIUM' ? 'ACTIVE' : 'INACTIVE'
            });
            setUsers(users.map(u => u.id === userId ? { ...u, plan: nextPlan } : u));
        } catch (err) {
            alert('Failed to update plan');
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        if (!window.confirm('Change this user\'s access level?')) return;
        try {
            const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
            await api.users.updateProfile(userId, { role: nextRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: nextRole } : u));
        } catch (err) {
            alert('Failed to update role');
        }
    };

    const exportUsersCSV = () => {
        const headers = ['Email', 'Name', 'Role', 'Plan', 'Capital', 'Joined'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [
                u.email,
                `"${u.full_name || ''}"`,
                u.role,
                u.plan,
                u.initial_capital || 0,
                new Date(u.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const exportWebinarCSV = () => {
        const headers = ['Name', 'WhatsApp', 'Date', 'Registered At'];
        const csvContent = [
            headers.join(','),
            ...webinarRegistrations.map(r => [
                `"${r.name}"`,
                r.whatsapp,
                r.webinar_date,
                new Date(r.created_at).toLocaleString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webinar_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Loading Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-100 p-12 rounded-[3rem] text-center space-y-4 font-body">
                <ShieldAlert className="mx-auto text-rose-500" size={48} />
                <h3 className="text-xl font-bold text-rose-900 uppercase">Connection Error</h3>
                <p className="text-rose-600 max-w-md mx-auto text-sm">{error}</p>
                <div className="flex gap-4 justify-center pt-4">
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase hover:bg-rose-700 transition-all">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 font-body">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none font-heading">Admin Dashboard</h1>
                    <SubHeading className="mt-4">Platform Overview & Management</SubHeading>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button onClick={loadAdminData} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        {(['overview', 'users', 'trades', 'webinar'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all font-heading",
                                    activeTab === tab
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<Users className="text-indigo-600" size={20} />}
                            label="Total Users"
                            value={stats?.totalUsers || 0}
                            trend={`+${stats?.recentSignups} this week`}
                        />
                        <StatCard
                            icon={<Star className="text-amber-500" size={20} />}
                            label="Premium Members"
                            value={stats?.premiumUsers || 0}
                            trend="Verified Users"
                        />
                        <StatCard
                            icon={<Zap className="text-blue-600" size={20} />}
                            label="Total Trades"
                            value={stats?.totalTrades || 0}
                            trend="System Wide"
                        />
                        <StatCard
                            icon={<TrendingUp className="text-emerald-600" size={20} />}
                            label="Value Tracked"
                            value={`₹${(stats?.totalVolume || 0).toLocaleString()}`}
                            trend="Total Portfolio Net"
                        />
                    </div>

                    {/* Recent Users List */}
                    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight font-heading">New Registrations</h3>
                                <SubHeading className="mt-2 mb-0">Latest join requests</SubHeading>
                            </div>
                            <button onClick={() => setActiveTab('users')} className="px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 hover:bg-slate-200 hover:text-indigo-600 transition-all font-heading">
                                View Registry <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 font-heading">
                                    <tr>
                                        <th className="px-10 py-5">User</th>
                                        <th className="px-10 py-5">Plan</th>
                                        <th className="px-10 py-5">Joined</th>
                                        <th className="px-10 py-5 text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.slice(0, 5).map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                                                        {u.full_name?.[0] || u.email?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{u.full_name || 'Anonymous'}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium lowercase">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase border",
                                                    u.plan === 'PREMIUM' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-100 text-slate-400 border-transparent"
                                                )}>
                                                    {u.plan}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-slate-500 text-xs">
                                                {formatDate(u.created_at)}
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <button onClick={() => togglePremium(u.id, u.plan)} className="p-2.5 text-slate-300 hover:text-indigo-600 transition-all hover:bg-indigo-50 rounded-xl">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight font-heading">Member Registry</h3>
                            <SubHeading className="mt-2 mb-0">Identify and manage users</SubHeading>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="SEARCH USERS..."
                                    className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all w-full md:w-64 font-heading"
                                />
                            </div>
                            <button onClick={exportUsersCSV} className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 font-heading">
                                <tr>
                                    <th className="px-10 py-5">Identity</th>
                                    <th className="px-10 py-5">Role</th>
                                    <th className="px-10 py-5">Plan</th>
                                    <th className="px-10 py-5">Capital</th>
                                    <th className="px-10 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 shadow-inner">
                                                    {u.full_name?.[0] || u.email?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{u.full_name || 'Anonymous'}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 lowercase">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <button
                                                onClick={() => toggleRole(u.id, u.role)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase border transition-all",
                                                    u.role === 'ADMIN' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                                )}
                                            >
                                                {u.role || 'USER'}
                                            </button>
                                        </td>
                                        <td className="px-10 py-6">
                                            <button
                                                onClick={() => togglePremium(u.id, u.plan)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase border transition-all",
                                                    u.plan === 'PREMIUM'
                                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                                )}
                                            >
                                                {u.plan}
                                            </button>
                                        </td>
                                        <td className="px-10 py-6 font-bold text-slate-900 text-sm">
                                            ₹{(u.initial_capital || 0).toLocaleString()}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-all rounded-xl hover:bg-indigo-50">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'trades' && (
                <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-10 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight font-heading">Global Activity</h3>
                        <SubHeading className="mt-2 mb-0">Monitoring live executions</SubHeading>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 font-heading">
                                <tr>
                                    <th className="px-10 py-5">Trader</th>
                                    <th className="px-10 py-5">Asset</th>
                                    <th className="px-10 py-5">Side</th>
                                    <th className="px-10 py-5">P&L</th>
                                    <th className="px-10 py-5 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {trades.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="font-bold text-slate-900 text-xs uppercase">
                                                {Array.isArray(t.users) ? t.users[0]?.full_name : t.users?.full_name || 'Unknown'}
                                            </p>
                                            <p className="text-[9px] font-medium text-slate-400 lowercase truncate w-32">
                                                {Array.isArray(t.users) ? t.users[0]?.email : t.users?.email}
                                            </p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700">
                                                {t.instrument}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-bold uppercase",
                                                t.direction === 'BUY' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            )}>
                                                {t.direction}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={cn(
                                                "font-bold text-sm",
                                                t.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                                            )}>
                                                {t.net_pnl >= 0 ? '+' : ''}{t.net_pnl.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right text-slate-500 text-xs">
                                            {formatDate(t.date)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'webinar' && (
                <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight font-heading">Webinar Signups</h3>
                            <SubHeading className="mt-2 mb-0">Manage event attendees</SubHeading>
                        </div>
                        <button onClick={exportWebinarCSV} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-indigo-600/20 font-heading">
                            <Download size={18} /> Export List
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 font-heading">
                                <tr>
                                    <th className="px-10 py-5">Attendee</th>
                                    <th className="px-10 py-5">WhatsApp</th>
                                    <th className="px-10 py-5">Webinar Date</th>
                                    <th className="px-10 py-5 text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {webinarRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-20 text-center text-slate-400 text-sm italic font-medium">
                                            No registrations yet.
                                        </td>
                                    </tr>
                                ) : (
                                    webinarRegistrations.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                                                        {r.name[0]?.toUpperCase()}
                                                    </div>
                                                    <p className="font-bold text-slate-900">{r.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 font-bold text-slate-600">
                                                {r.whatsapp}
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-bold uppercase">
                                                    {r.webinar_date}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right text-slate-500 text-xs">
                                                {formatDate(r.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend: string }) {
    return (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center transition-all group-hover:bg-indigo-50 group-hover:border-indigo-100">
                    {icon}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase font-heading">{label}</p>
                <p className="text-3xl font-bold text-slate-900 font-heading">{value}</p>
                <div className="flex items-center gap-1.5 pt-2">
                    <ArrowUpRight size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">{trend}</span>
                </div>
            </div>
        </div>
    );
}
