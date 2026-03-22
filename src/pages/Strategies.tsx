import { Microscope, Brain, Sparkles, Plus, Gauge, Info, X, Target, Activity, Edit2, Trash2, MoreVertical, Layers } from 'lucide-react';
import { SubHeading } from '@/components/ui/SubHeading';
import { Modal } from '@/components/ui/Modal';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useStrategies } from '@/hooks/useStrategies';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats, formatCurrency } from '@/lib/stats';
import type { Strategy } from '@/types';
import { STRATEGY_BLUEPRINTS } from '@/lib/blueprints';

export default function Strategies() {
    const { strategies, isLoading, addStrategy, updateStrategy, deleteStrategy } = useStrategies();
    const { trades } = useTrades();
    const [filter, setFilter] = useState('ALL');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showBlueprints, setShowBlueprints] = useState(false);
    const [newStrategy, setNewStrategy] = useState({ name: '', description: '', status: 'ACTIVE' as const, risk_per_trade: 0, rules: [] as any[] });
    const [viewingStrategy, setViewingStrategy] = useState<any>(null); // For trades modal
    const [ruleInput, setRuleInput] = useState('');
    const [ruleType, setRuleType] = useState<'ENTRY' | 'EXIT' | 'RISK'>('ENTRY');

    const handleAddRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleInput.trim()) return;
        setNewStrategy(prev => ({
            ...prev,
            rules: [...prev.rules, { id: crypto.randomUUID(), text: ruleInput, type: ruleType }]
        }));
        setRuleInput('');
    };

    const removeRule = (id: string) => {
        setNewStrategy(prev => ({
            ...prev,
            rules: prev.rules.filter(r => r.id !== id)
        }));
    };

    const strategiesWithStats = useMemo(() => {
        return strategies.map((s: any) => {
            const strategyTrades = trades.filter(t => (t.strategy || '').toUpperCase() === s.name.toUpperCase());
            const stats = calculateStats(strategyTrades);
            return {
                ...s,
                stats,
                trades: strategyTrades
            };
        });
    }, [strategies, trades]);

    const filteredStrategies = useMemo(() => {
        if (filter === 'ALL') return strategiesWithStats;
        return strategiesWithStats.filter((s: any) => s.status === filter);
    }, [strategiesWithStats, filter]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStrategy.name) return;

        if (editingId) {
            await updateStrategy.mutateAsync({ id: editingId, updates: newStrategy as any });
            setEditingId(null);
        } else {
            await addStrategy.mutateAsync(newStrategy as any);
        }

        setNewStrategy({ name: '', description: '', status: 'ACTIVE' as const, risk_per_trade: 0, rules: [] });
        setIsAdding(false);
    };

    const handleEdit = (strategy: any) => {
        setNewStrategy({
            name: strategy.name,
            description: strategy.description || '',
            status: strategy.status,
            risk_per_trade: strategy.risk_per_trade || 0,
            rules: strategy.rules || []
        });
        setEditingId(strategy.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this strategy?')) {
            deleteStrategy.mutate(id);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-body pb-20">
            {/* Elite Header */}
            <div className="relative p-12 bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-50/50 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-110" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-xl shadow-slate-200 transition-transform group-hover:-rotate-6">
                            <Microscope className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 border-none leading-none">My Trading Strategies</h1>
                            <SubHeading className="mt-2 text-indigo-600">Your collection of setups and trading plans.</SubHeading>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowBlueprints(!showBlueprints)}
                            className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 shadow-sm hover:border-indigo-600 transition-all font-heading"
                        >
                            <Sparkles size={18} className="text-amber-500" />
                            Setup Templates
                        </button>
                        <button
                            onClick={() => {
                                setIsAdding(true);
                                setEditingId(null);
                                setNewStrategy({ name: '', description: '', status: 'ACTIVE', risk_per_trade: 0, rules: [] });
                            }}
                            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 shadow-2xl hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all font-heading"
                        >
                            <Plus size={18} />
                            New Strategy
                        </button>
                    </div>
                </div>
            </div>

            {/* Blueprints Modal */}
            <Modal
                isOpen={showBlueprints}
                onClose={() => setShowBlueprints(false)}
                title="Ready-to-Use Setups"
                maxWidth="7xl"
            >
                <div className="space-y-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Add common trading plans to your collection</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STRATEGY_BLUEPRINTS.map((blueprint, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    addStrategy.mutate(blueprint as any);
                                    setShowBlueprints(false);
                                }}
                                className="p-8 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-3xl flex flex-col items-start gap-6 transition-all group/btn text-left"
                            >
                                <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-all">
                                    <Plus size={20} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-bold tracking-tight text-slate-900">{blueprint.name}</p>
                                    <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{blueprint.description}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between">
                                    <span className="text-[9px] font-bold uppercase text-indigo-600">Risk: {formatCurrency(blueprint.risk_per_trade)}</span>
                                    <span className="text-[9px] font-bold uppercase text-slate-400">{blueprint.status}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Strategy Marketplace/Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm space-y-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-6">Filter by Status</p>
                            <div className="flex flex-col gap-2">
                                {['ALL', 'ACTIVE', 'BACKTESTING', 'ARCHIVED'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={cn(
                                            "px-6 py-4 rounded-2xl text-[11px] font-bold transition-all text-left flex items-center justify-between group",
                                            filter === status
                                                ? "bg-slate-900 text-white shadow-xl translate-x-1"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        )}
                                    >
                                        {status}
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-lg",
                                            filter === status ? "bg-white/20" : "bg-slate-100 text-slate-400 font-bold"
                                        )}>
                                            {status === 'ALL' ? strategies.length : strategies.filter((s: any) => s.status === status).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <Gauge size={18} className="text-indigo-600" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Capacity</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(strategies.length / 10) * 100}%` }} />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase text-center">{strategies.length} / 10 Active Plans</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[3rem] shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Info size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-900/60 leading-relaxed uppercase">
                            Focus on one plan until it works well. Don't try too many at once.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <Modal
                        isOpen={isAdding}
                        onClose={() => { setIsAdding(false); setEditingId(null); }}
                        title={editingId ? 'Refine Strategy Protocol' : 'Develop New Setup DNA'}
                        maxWidth="5xl"
                    >
                        <form onSubmit={handleCreate} className="space-y-10 leading-none">
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Strategy Designation</label>
                                    <input
                                        autoFocus required
                                        type="text"
                                        value={newStrategy.name}
                                        onChange={e => setNewStrategy({ ...newStrategy, name: e.target.value })}
                                        placeholder="e.g., Morning Breakout"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-xl font-bold transition-all text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                                    />
                                </div>
                                <div className="w-full md:w-64 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Initial Status</label>
                                    <select
                                        value={newStrategy.status}
                                        onChange={e => setNewStrategy({ ...newStrategy, status: e.target.value as any })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-xl font-bold transition-all text-slate-900 focus:bg-white focus:border-indigo-600 outline-none appearance-none"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="BACKTESTING">TESTING</option>
                                        <option value="ARCHIVED">ARCHIVED</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Tactical Description</label>
                                <textarea
                                    value={newStrategy.description}
                                    onChange={e => setNewStrategy({ ...newStrategy, description: e.target.value })}
                                    placeholder="Explain when to enter, when to exit, and what to watch for..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 px-8 text-lg font-medium transition-all text-slate-900 focus:bg-white focus:border-indigo-600 outline-none min-h-[120px]"
                                />
                            </div>

                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Setup Checkpoints</label>
                                    <div className="flex gap-2">
                                        {(['ENTRY', 'EXIT', 'RISK'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setRuleType(type)}
                                                className={cn(
                                                    "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                                                    ruleType === type ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={ruleInput}
                                        onChange={e => setRuleInput(e.target.value)}
                                        placeholder={`Add a new ${ruleType.toLowerCase()} rule...`}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all text-slate-900"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddRule(e);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddRule}
                                        className="px-6 py-4 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {newStrategy.rules.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2">
                                        {newStrategy.rules.map((rule: any) => (
                                            <div key={rule.id} className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-lg text-[9px] font-bold uppercase",
                                                        rule.type === 'ENTRY' ? "bg-emerald-100 text-emerald-600" :
                                                            rule.type === 'EXIT' ? "bg-amber-100 text-amber-600" :
                                                                "bg-rose-100 text-rose-600"
                                                    )}>
                                                        {rule.type}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-700">{rule.text}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRule(rule.id)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest leading-none mb-3">Target Risk Allocation (Γé╣)</p>
                                    <input
                                        type="number"
                                        value={newStrategy.risk_per_trade}
                                        onChange={e => setNewStrategy({ ...newStrategy, risk_per_trade: Number(e.target.value) })}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-2xl font-bold text-slate-900 w-44 outline-none focus:bg-white focus:border-indigo-600"
                                        placeholder="0"
                                    />
                                </div>
                                <button type="submit" className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all">
                                    {editingId ? 'Update Setup Protocol' : 'Deploy Deployment DNA'}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredStrategies.length === 0 && !isAdding && (
                            <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-200 rounded-[4rem] bg-slate-50/50">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <Target size={32} />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No strategies found in this category.</p>
                                <button onClick={() => setShowBlueprints(true)} className="mt-8 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-indigo-600 text-[10px] font-bold uppercase shadow-sm hover:border-indigo-600 transition-all">Select Strategy Templates</button>
                            </div>
                        )}
                        {filteredStrategies.map((strategy: any) => (
                            <ArsenalCard
                                key={strategy.id}
                                strategy={strategy}
                                onEdit={() => handleEdit(strategy)}
                                onDelete={() => handleDelete(strategy.id)}
                                onViewTrades={() => setViewingStrategy(strategy)}
                            />
                        ))}
                    </div>

                    {/* Trades Modal */}
                    <Modal
                        isOpen={!!viewingStrategy}
                        onClose={() => setViewingStrategy(null)}
                        title={viewingStrategy?.name}
                        maxWidth="5xl"
                    >
                        <div className="space-y-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-4">Tactical execution history</p>
                            {(viewingStrategy?.trades || []).length === 0 ? (
                                <div className="h-60 flex flex-col items-center justify-center text-slate-300 gap-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <Info size={32} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No trades recorded for this setup yet.</p>
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                {['Date', 'Symbol', 'Side', 'Result', 'P&L'].map(h => (
                                                    <th key={h} className="p-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {(viewingStrategy.trades || []).map((t: any) => (
                                                <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group/row">
                                                    <td className="p-6 text-xs font-bold text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                                                    <td className="p-6 text-sm font-bold text-slate-900">{t.instrument}</td>
                                                    <td className={cn("p-6 text-[10px] font-bold uppercase", t.direction === 'LONG' ? "text-emerald-600" : "text-rose-600")}>{t.direction}</td>
                                                    <td className="p-6">
                                                        <span className={cn(
                                                            "px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider shadow-sm",
                                                            t.net_pnl > 0 ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-rose-500 text-white shadow-rose-100"
                                                        )}>
                                                            {t.net_pnl > 0 ? 'WIN' : 'LOSS'}
                                                        </span>
                                                    </td>
                                                    <td className={cn("p-6 text-sm font-bold tracking-tight", t.net_pnl > 0 ? "text-emerald-600" : "text-rose-600")}>
                                                        {formatCurrency(t.net_pnl)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

function ArsenalCard({ strategy, onEdit, onDelete, onViewTrades }: { strategy: any, onEdit: () => void, onDelete: () => void, onViewTrades: () => void }) {
    const { stats } = strategy;

    return (
        <div className="group relative bg-white border border-slate-200 rounded-[3.5rem] p-10 hover:border-indigo-500 transition-all duration-500 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8 leading-none">
                <div className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-bold uppercase shadow-sm flex items-center gap-2",
                    strategy.status === 'ACTIVE' ? "bg-emerald-500 text-white shadow-emerald-100" :
                        strategy.status === 'BACKTESTING' ? "bg-amber-500 text-white shadow-amber-100" : "bg-slate-100 text-slate-600"
                )}>
                    {strategy.status === 'ACTIVE' && <Activity size={10} />}
                    {strategy.status}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onDelete} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                    </button>
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors uppercase leading-tight mb-3">{strategy.name}</h3>
                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2 opacity-80">{strategy.description || 'Strategy details pending.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <MetricBox label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} progress={stats.winRate} color="emerald" />
                    <MetricBox label="Profit Factor" value={stats.profitFactor.toFixed(2)} progress={Math.min(stats.profitFactor * 30, 100)} color="indigo" />
                </div>
            </div>

            <div className="mt-10 p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 pl-6">
                    <div className="space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Max Risk</p>
                        <p className="text-base font-bold text-slate-900 tracking-tight">{formatCurrency(strategy.risk_per_trade || 0)}</p>
                    </div>
                </div>
                <div onClick={onViewTrades} className="h-14 w-auto px-6 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-indigo-600 hover:border-indigo-200 transition-all relative cursor-pointer gap-2 group/btn">
                    <span className="text-[10px] font-bold uppercase hidden group-hover/btn:block animate-in fade-in slide-in-from-right-2">View Trades</span>
                    <Layers size={20} />
                    {(strategy.rules || []).length > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-white">
                            {(strategy.rules || []).length}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricBox({ label, value, progress, color }: { label: string, value: string, progress: number, color: 'emerald' | 'indigo' }) {
    return (
        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
            <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase opacity-60 tracking-widest leading-none">{label}</p>
                <p className="text-2xl font-bold tracking-tighter text-slate-900 leading-none">{value}</p>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    color === 'emerald' ? "bg-emerald-500" : "bg-indigo-600"
                )} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
