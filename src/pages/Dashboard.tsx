import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { useRules } from '@/hooks/useRules';
import { useMistakes } from '@/hooks/useMistakes';
import { calculateStats, formatCurrency } from '@/lib/stats';
import {
    Plus,
    ShieldCheck,
    Target,
    Clock,
    ChevronRight,
    Wallet,
    Trophy,
    History,
    Activity,
    Zap,
    Sparkles,
    UserCircle,
    Settings,
    CheckCircle2,
    HeartCrack,
    ShieldAlert
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { TradeForm } from '@/components/features/TradeForm';
import { SubHeading } from '@/components/ui/SubHeading';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, profile, refreshProfile, loading: authLoading } = useAuth();
    const { trades, isLoading: tradesLoading } = useTrades();
    const { rules, toggleRule } = useRules();
    const { mistakes } = useMistakes();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSettingCapital, setIsSettingCapital] = useState(false);
    const [tempCapital, setTempCapital] = useState(profile?.initial_capital?.toString() || '0');

    useEffect(() => {
        if (profile?.initial_capital !== undefined) {
            setTempCapital(profile.initial_capital.toString());
        }
    }, [profile?.initial_capital]);

    const stats = calculateStats(trades, profile?.initial_capital || 0);

    const handleUpdateCapital = async () => {
        if (!user) return;
        setIsSettingCapital(false); // Close immediately for responsive feel
        const val = parseFloat(tempCapital);
        if (isNaN(val)) return;

        const { error } = await supabase
            .from('users')
            .update({ initial_capital: val } as never)
            .eq('id', user.id);

        if (!error) {
            await refreshProfile();
        }
    };

    const handleSync = async () => {
        await refreshProfile();
        queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['mistakes', user?.id] });
    };

    const chartData: { name: string; balance: number; date: string }[] = [];
    let currentBalanceTotal = profile?.initial_capital || 0;

    [...trades]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach(trade => {
            currentBalanceTotal += trade.net_pnl;
            chartData.push({
                name: new Date(trade.date).toLocaleDateString(undefined, { weekday: 'short' }),
                balance: currentBalanceTotal,
                date: trade.date
            });
        });

    const mistakesWithStats = useMemo(() => {
        return mistakes.map(m => {
            const linkedTrades = trades.filter(t => t.mistake_ids?.includes(m.id));
            const totalLost = linkedTrades.reduce((sum, t) => sum + Math.abs(t.net_pnl < 0 ? t.net_pnl : 0), 0);
            return { ...m, totalLost };
        }).sort((a, b) => b.totalLost - a.totalLost);
    }, [mistakes, trades]);

    if (authLoading || tradesLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center animate-bounce shadow-inner">
                        <Zap size={32} className="text-indigo-600 fill-indigo-600" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calibrating Data Matrix...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-body">
            {/* Morning Style Hero Section */}
            <div className="relative p-10 bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm group font-heading">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-3xl rounded-full -z-10" />

                <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10 leading-none">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <UserCircle className="w-12 h-12 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 text-slate-900 border-none">
                                Welcome, {profile?.full_name?.split(' ')[0] || 'Trader'}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                                    <Sparkles size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-bold text-indigo-600">Premium Membership</span>
                                </div>
                                {profile?.plan === 'PREMIUM' && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                                        <Trophy size={11} className="text-amber-600" />
                                        <span className="text-[10px] font-bold text-amber-600">Pro</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSync}
                                className="px-8 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-[10px] flex items-center gap-3 hover:bg-slate-50 transition-all border border-indigo-100 shadow-sm"
                            >
                                <RotateCcw size={18} />
                                Sync
                            </button>
                            <button
                                onClick={() => navigate('/journal')}
                                className="px-8 py-5 bg-slate-100/50 text-slate-400 rounded-2xl font-bold text-[10px] flex items-center gap-3 hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <History size={18} />
                                History
                            </button>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-[10px] flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus size={20} />
                                Record Trade
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Metrics Grid - 4 Metrics Only as requested */}
            < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-heading leading-none" >
                <MetricCard icon={<Wallet size={16} />} label="Total Invested" value={formatCurrency(profile?.initial_capital || 0)} variant="white" onClick={() => setIsSettingCapital(true)} />
                <MetricCard icon={<Activity size={16} />} label="Net P/L" value={formatCurrency(stats.netPnl)} variant={stats.netPnl >= 0 ? "emerald" : "rose"} />
                <MetricCard icon={<Target size={16} />} label="Risk to Reward" value={`1:${stats.avgRR.toFixed(2)}`} variant="amber" />
                <MetricCard icon={<CheckCircle2 size={16} />} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} variant="purple" />
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Curve */}
                <div className="lg:col-span-2 p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 font-heading tracking-tighter">Equity Curve</h2>
                            <SubHeading className="mt-2 opacity-60">Capital fluctuation over time</SubHeading>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'Empty', balance: profile?.initial_capital || 0 }]}>
                                <defs>
                                    <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={10} className="font-heading" />
                                <YAxis stroke="#cbd5e1" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} dx={-10} className="font-heading" />
                                <Tooltip
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'heading' }}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCurve)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Rules Checklist */}
                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm flex flex-col font-heading">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tighter">Daily Checklist</h2>
                            <SubHeading className="mt-2 opacity-60">Trading Protocol</SubHeading>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
                        {rules.filter(r => r.is_daily).length === 0 ? (
                            <div className="py-12 text-center opacity-40">
                                <p className="text-[10px] font-bold uppercase  text-slate-400">No daily rules set</p>
                                <button
                                    onClick={() => navigate('/rules')}
                                    className="mt-4 text-[9px] font-bold text-indigo-600 uppercase underline"
                                >
                                    Set Daily Rules
                                </button>
                            </div>
                        ) : (
                            rules.filter(r => r.is_daily).map((rule) => (
                                <div
                                    key={rule.id}
                                    onClick={() => toggleRule.mutate({ id: rule.id, completed: !rule.completed })}
                                    className={cn(
                                        "p-5 rounded-[1.5rem] border flex items-center gap-5 transition-all cursor-pointer group leading-none",
                                        rule.completed ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-slate-50 border-slate-100 hover:border-indigo-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                        rule.completed ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-200 group-hover:border-indigo-500"
                                    )}>
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className={cn("text-[13px] font-bold tracking-tight", rule.completed && "line-through opacity-40")}>{rule.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/rules')}
                        className="mt-8 py-5 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase  text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                    >
                        View Protocols
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Psychology Summary */}
                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm font-heading">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tighter">Psychology Audit</h2>
                            <SubHeading className="mt-2 opacity-60">Mistakes breakdown</SubHeading>
                        </div>
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                            <HeartCrack className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {mistakesWithStats.slice(0, 3).map((m) => (
                            <div key={m.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-rose-100 transition-all leading-none">
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                                        <ShieldAlert size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase">{m.title}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase  mt-1">Severity: {m.severity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-rose-500 leading-none tracking-tighter">-{formatCurrency(m.totalLost)}</p>
                                    <p className="text-[9px] font-bold text-slate-300 mt-1">Total Impact</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trade Activity */}
                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm font-heading">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tighter">Recent Activity</h2>
                            <SubHeading className="mt-2 opacity-60">Latest executions</SubHeading>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {trades.slice(0, 4).map((trade) => (
                            <div key={trade.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between hover:border-indigo-200 transition-all cursor-pointer group leading-none">
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shadow-sm",
                                        trade.net_pnl >= 0 ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
                                    )}>
                                        {trade.direction[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{trade.instrument}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase  mt-1 opacity-60">{new Date(trade.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={cn("text-lg font-bold tracking-tighter", trade.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                    {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Capital Setting Modal */}
            {
                isSettingCapital && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="w-full max-w-sm bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl space-y-10 font-heading leading-none">
                            <div>
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
                                    <Wallet size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Set Capital</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase  mt-2 opacity-60 leading-relaxed">Define your baseline equity for all calculations.</p>
                            </div>
                            <div className="space-y-4">
                                <input
                                    autoFocus
                                    type="number"
                                    value={tempCapital}
                                    onChange={(e) => setTempCapital(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 px-8 text-2xl font-bold outline-none focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all text-slate-900 tracking-tighter"
                                    placeholder="₹ 0.00"
                                />
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setIsSettingCapital(false)} className="flex-1 py-5 bg-slate-100 rounded-2xl text-[10px] font-bold uppercase  text-slate-400 hover:bg-slate-200 transition-all">Cancel</button>
                                    <button onClick={handleUpdateCapital} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase  shadow-xl hover:bg-indigo-600 transition-all">Update Equity</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {isFormOpen && <TradeForm onClose={() => setIsFormOpen(false)} />}
        </div >
    );
}

function MetricCard({ icon, label, value, variant = "white", onClick }: { icon: React.ReactNode, label: string, value: string, variant?: string, onClick?: () => void }) {
    const variants = {
        emerald: "bg-[#10b981] text-white shadow-xl shadow-[#10b981]/20 border-transparent",
        amber: "bg-[#f59e0b] text-white shadow-xl shadow-[#f59e0b]/20 border-transparent",
        rose: "bg-[#f43f5e] text-white shadow-xl shadow-[#f43f5e]/20 border-transparent",
        purple: "bg-[#8b5cf6] text-white shadow-xl shadow-[#8b5cf6]/20 border-transparent",
        white: "bg-white text-slate-900 border-slate-200 shadow-sm",
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-8 rounded-[2.5rem] flex flex-col justify-between h-48 border transition-all hover:scale-[1.02] hover:-translate-y-1 group relative overflow-hidden",
                variants[variant as keyof typeof variants],
                onClick && "cursor-pointer active:scale-95"
            )}
        >
            <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-sm",
                        variant === 'white' ? "bg-slate-50 border-slate-100 text-slate-500" : "bg-white/20 border-white/20 text-white"
                    )}>
                        {icon}
                    </div>
                    <span className="text-[10px] font-bold opacity-80">{label}</span>
                </div>
                {onClick && <Settings size={14} className="opacity-40 group-hover:opacity-100 transition-all" />}
            </div>
            <span className="relative z-10 text-3xl font-bold tracking-tighter">{value}</span>
        </div>
    );
}
