import { useTrades } from '@/hooks/useTrades';
import { useAuth } from '@/context/AuthContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { calculateStats, formatCurrency } from '@/lib/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie } from 'recharts';
import { Lock, Zap, BarChart2, Shield, Brain, Target, TrendingDown, PieChart as PieIcon, Activity, Clock, TrendingUp, LayoutGrid, ChevronUp, Plus, XCircle, Wallet, Trophy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquityChart } from '@/components/features/EquityChart';
import { useState } from 'react';

function SubTab({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2.5 px-8 py-3 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all shrink-0",
                active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
            )}
        >
            {icon} {label}
        </button>
    );
}

function StatCard({ label, value, subValue, icon, variant = 'indigo' }: any) {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "p-5 rounded-2xl shadow-lg transition-transform group-hover:rotate-6",
                    variant === 'indigo' ? "bg-indigo-600 text-white" :
                        variant === 'emerald' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                )}>
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide opacity-60">{subValue}</p>
            </div>
        </div>
    );
}

export default function Analytics() {
    const { trades } = useTrades();
    const { profile, upgradePlan } = useAuth();
    const { openCheckout } = useRazorpay();
    const [activeTab, setActiveTab] = useState<'performance' | 'strategies' | 'mistakes'>('performance');

    const handleUpgrade = async () => {
        try {
            await openCheckout(1499, 'Pro Annual Subscription');
            await upgradePlan('PREMIUM');
        } catch (e) {
            console.error(e);
        }
    };

    const isPremium = profile?.plan === 'PREMIUM';

    // --- Calculations ---
    const mistakeStats: Record<string, number> = {};
    trades.forEach(trade => {
        if (trade.tags) {
            trade.tags.forEach(tag => {
                mistakeStats[tag] = (mistakeStats[tag] || 0) + trade.net_pnl;
            });
        }
    });

    const sortedMistakes = Object.entries(mistakeStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.value - b.value);

    const dayStats: Record<string, number> = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    trades.forEach(trade => {
        const day = dayNames[new Date(trade.date).getDay()];
        dayStats[day] = (dayStats[day] || 0) + trade.net_pnl;
    });

    const dayData = days.map(day => ({ name: day, value: dayStats[day] || 0 }));

    const assetStats: Record<string, number> = {};
    trades.forEach(trade => {
        const asset = trade.asset_class || 'INDEX';
        assetStats[asset] = (assetStats[asset] || 0) + (trade.entry_price * trade.quantity);
    });

    const assetData = Object.entries(assetStats).map(([name, value]) => ({ name, value }));
    const PIE_COLORS = ['#6366f1', '#a855f7', '#0ea5e9', '#10b981', '#f43f5e'];

    const stats = calculateStats(trades, profile?.initial_capital || 0);

    const bestDay = [...dayData].sort((a, b) => b.value - a.value)[0];

    // Customization Config
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [visibleMetrics, setVisibleMetrics] = useState<string[]>(['totalPnl', 'winRate', 'profitFactor', 'totalTrades', 'bestTrade', 'worstTrade']);

    const METRICS_CONFIG = [
        { id: 'invested', label: 'Invested Amount', value: formatCurrency(profile?.initial_capital || 0), icon: <Wallet size={20} />, variant: 'indigo' },
        { id: 'totalPnl', label: 'Total P/L', value: formatCurrency(stats.netPnl), icon: stats.netPnl >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />, variant: stats.netPnl >= 0 ? 'emerald' : 'rose' },
        { id: 'avgRR', label: 'Avg R:R', value: `${stats.avgRR.toFixed(2)}x`, icon: <Target size={20} />, variant: 'indigo' },
        { id: 'profitFactor', label: 'Profit Factor', value: `${stats.profitFactor.toFixed(2)}x`, icon: <Activity size={20} />, variant: 'indigo' },
        { id: 'bestTrade', label: 'Best Trade', value: formatCurrency(stats.bestTrade), icon: <Trophy size={20} />, variant: 'emerald' },
        { id: 'worstTrade', label: 'Worst Trade', value: formatCurrency(stats.worstTrade), icon: <TrendingDown size={20} />, variant: 'rose' },
        { id: 'totalTrades', label: 'Total Trades', value: stats.totalTrades, icon: <BarChart2 size={20} />, variant: 'indigo' },
        { id: 'winningTrades', label: 'Winning Trades', value: stats.winningTrades, icon: <CheckCircle2 size={20} />, variant: 'emerald' },
        { id: 'losingTrades', label: 'Losing Trades', value: stats.losingTrades, icon: <XCircle size={20} />, variant: 'rose' },
        { id: 'winRate', label: 'Win %', value: `${stats.winRate.toFixed(1)}%`, icon: <Target size={20} />, variant: stats.winRate >= 50 ? 'emerald' : 'indigo' },
        { id: 'totalProfit', label: 'Total Profit', value: formatCurrency(stats.totalProfit), icon: <TrendingUp size={20} />, variant: 'emerald' },
        { id: 'totalLoss', label: 'Total Loss', value: formatCurrency(stats.totalLoss), icon: <TrendingDown size={20} />, variant: 'rose' },
        { id: 'avgWin', label: 'Average Profit', value: formatCurrency(stats.avgWin), icon: <Plus size={20} />, variant: 'emerald' },
        { id: 'avgLoss', label: 'Average Loss', value: formatCurrency(stats.avgLoss), icon: <TrendingDown size={20} />, variant: 'rose' },
        { id: 'avgPnlPerTrade', label: 'Avg P&L / Trade', value: formatCurrency(stats.avgPnlPerTrade), icon: <Target size={20} />, variant: 'indigo' },
    ];

    const ALL_METRIC_KEYS = METRICS_CONFIG.map(m => m.id);

    if (!isPremium) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
                <div className="relative w-full max-w-4xl bg-white/70 backdrop-blur-3xl border border-indigo-500/10 rounded-[4rem] p-20 text-center overflow-hidden shadow-3xl ring-1 ring-indigo-500/5">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-indigo-500">
                        <Lock size={300} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[2.5rem] flex items-center justify-center shadow-3xl mb-12 animate-pulse">
                            <Lock className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">Master Your Trading Data</h1>
                        <p className="text-indigo-900/40 max-w-2xl mb-16 text-xl font-medium leading-relaxed">
                            See your performance clearly. Identify your best setups and find your biggest mistakes instantly.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
                            <ProFeatureCard icon={<Brain size={20} />} title="Performance Check" sub="Find where you leak edge" />
                            <ProFeatureCard icon={<Target size={20} />} title="Best Trading Hours" sub="Best execution windows" />
                            <ProFeatureCard icon={<TrendingDown size={20} />} title="History of Drops" sub="Comprehensive risk analytics" />
                        </div>

                        <button
                            onClick={handleUpgrade}
                            className="px-16 py-7 bg-indigo-600 text-white font-bold rounded-[2.2rem] hover:bg-black transition-all hover:scale-105 shadow-3xl text-[10px]"
                        >
                            GET PREMIUM ACCESS <Zap size={14} className="inline ml-3 fill-white" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-body">
            {/* Nav Tabs & Customization */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2 p-2 bg-white rounded-2xl border border-slate-200 w-fit shadow-sm">
                    <SubTab active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} icon={<Activity size={16} />} label="Overview" />
                    <SubTab active={activeTab === 'strategies'} onClick={() => setActiveTab('strategies')} icon={<LayoutGrid size={16} />} label="Strategies" />
                    <SubTab active={activeTab === 'mistakes'} onClick={() => setActiveTab('mistakes')} icon={<Target size={16} />} label="Mistakes" />
                </div>
                {activeTab === 'performance' && (
                    <button
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-[11px] font-bold uppercase transition-all flex items-center gap-2",
                            isCustomizing ? "bg-slate-900 text-white shadow-xl" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-400"
                        )}
                    >
                        <LayoutGrid size={16} />
                        {isCustomizing ? 'Done Customizing' : 'Customize Dashboard'}
                    </button>
                )}
            </div>

            {/* Customization Drawer */}
            {isCustomizing && activeTab === 'performance' && (
                <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-lg animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900">Select Metrics to Display</h3>
                        <button onClick={() => setVisibleMetrics(ALL_METRIC_KEYS)} className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Select All</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {METRICS_CONFIG.map(m => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    if (visibleMetrics.includes(m.id)) {
                                        setVisibleMetrics(visibleMetrics.filter(id => id !== m.id));
                                    } else {
                                        setVisibleMetrics([...visibleMetrics, m.id]);
                                    }
                                }}
                                className={cn(
                                    "p-4 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center gap-3",
                                    visibleMetrics.includes(m.id)
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-indigo-200"
                                )}
                            >
                                <div className={cn("w-4 h-4 rounded border flex items-center justify-center", visibleMetrics.includes(m.id) ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-200")}>
                                    {visibleMetrics.includes(m.id) && <CheckCircle2 size={10} className="text-white" />}
                                </div>
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'performance' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 leading-none">
                        {METRICS_CONFIG.filter(m => visibleMetrics.includes(m.id)).map(m => (
                            <StatCard
                                key={m.id}
                                label={m.label}
                                value={m.value}
                                icon={m.icon}
                                variant={m.variant as any}
                            />
                        ))}
                        {visibleMetrics.length === 0 && (
                            <div className="col-span-full p-10 text-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 opacity-60">
                                <p className="text-sm font-bold uppercase">No metrics selected</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 leading-none">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-bold font-heading tracking-tight text-slate-900 uppercase">Equity Curve</h3>
                                        <p className="text-[10px] font-bold font-heading text-slate-400 mt-2 opacity-40 italic">Balance Growth</p>
                                    </div>
                                </div>
                                <div className="h-[400px]">
                                    <EquityChart trades={trades} initialCapital={profile?.initial_capital || 100000} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <MiniInsightCard label="Best Session" value={bestDay.name} icon={<Clock size={20} />} />
                                <MiniInsightCard label="Max Drawdown" value={formatCurrency(stats.maxDrawdown)} icon={<TrendingDown size={20} />} />
                            </div>

                            <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-bold font-heading tracking-tight text-slate-900 uppercase">Execution Timing</h3>
                                        <p className="text-[10px] font-bold font-heading text-slate-400 mt-2 opacity-40 italic">Winning Day Analysis</p>
                                    </div>
                                </div>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dayData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" fontSize={10} fontWeight="800" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                                            <YAxis fontSize={10} fontWeight="800" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `Γé╣${val / 1000}k`} dx={-10} />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '1.5rem',
                                                    fontWeight: '900',
                                                    fontSize: '10px',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                                                {dayData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm flex flex-col items-center">
                                <div className="w-full mb-10 text-center">
                                    <h3 className="text-xl font-bold font-heading tracking-tight text-slate-900 uppercase">Allocation</h3>
                                    <p className="text-[10px] font-bold font-heading text-slate-400 mt-2 opacity-40 italic">Market Distribution</p>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={assetData.length > 0 ? assetData : [{ name: 'Empty', value: 1 }]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {assetData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '1.5rem',
                                                    fontWeight: '900',
                                                    fontSize: '10px'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full mt-10 space-y-4">
                                    {assetData.map((alt, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[11px] font-bold font-heading uppercase">
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                                                <span>{alt.name}</span>
                                            </div>
                                            <span className="text-slate-900 tracking-tight">Γé╣{(alt.value / 1000).toFixed(1)}k</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MiniInsightCard({ label, value, icon }: any) {
    return (
        <div className="p-12 bg-white border border-slate-200 rounded-[3.5rem] flex items-center justify-between shadow-sm group hover:scale-[1.03] transition-all duration-500">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity uppercase">{label}</p>
                <p className="text-3xl font-bold tracking-tighter text-slate-900 leading-none">{value}</p>
            </div>
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                {icon}
            </div>
        </div>
    );
}

function ProFeatureCard({ icon, title, sub }: any) {
    return (
        <div className="p-10 bg-white border border-slate-200 rounded-[3.5rem] text-left flex items-start gap-8 transition-all hover:border-indigo-400 group hover:shadow-sm shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {icon}
            </div>
            <div className="leading-tight mt-1">
                <p className="text-xl font-bold tracking-tight mb-2 text-slate-900">{title}</p>
                <p className="text-[10px] text-slate-400 font-bold leading-none mt-2">{sub}</p>
            </div>
        </div>
    );
}
