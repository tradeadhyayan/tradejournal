import { AlertOctagon, LayoutGrid, Plus, TrendingDown, ShieldAlert, Activity, Target, Edit2, Trash2, MoreVertical, Zap } from 'lucide-react';
import { SubHeading } from '@/components/ui/SubHeading';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useTrades } from '@/hooks/useTrades';
import { useMistakes } from '@/hooks/useMistakes';
import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/stats';
import { MISTAKE_BLUEPRINTS } from '@/lib/blueprints';

export default function Mistakes() {
    const { trades } = useTrades();
    const { mistakes, addMistake, updateMistake, deleteMistake } = useMistakes();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showBlueprints, setShowBlueprints] = useState(false);
    const [newMistake, setNewMistake] = useState({ title: '', severity: 'MEDIUM', description: '' });

    const mistakesWithStats = useMemo(() => {
        return mistakes.map((m: any) => {
            const relatedTrades = trades.filter(t => t.mistake_ids?.includes(m.id));
            const totalCost = relatedTrades.reduce((acc, t) => acc + (t.net_pnl < 0 ? Math.abs(t.net_pnl) : 0), 0);
            return {
                ...m,
                tradeCount: relatedTrades.length,
                totalCost
            };
        }).sort((a: any, b: any) => b.totalCost - a.totalCost);
    }, [mistakes, trades]);

    const stats = useMemo(() => {
        const totalLost = mistakesWithStats.reduce((acc: number, m: any) => acc + m.totalCost, 0);
        const criticalCount = mistakesWithStats.filter((m: any) => m.severity === 'CRITICAL' || m.severity === 'HIGH').length;
        return { totalLost, criticalCount };
    }, [mistakesWithStats]);

    const handleAddMistake = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMistake.title) return;

        if (editingId) {
            await updateMistake.mutateAsync({ id: editingId, updates: newMistake as any });
            setEditingId(null);
        } else {
            await addMistake.mutateAsync(newMistake as any);
        }

        setNewMistake({ title: '', severity: 'MEDIUM', description: '' });
        setIsAdding(false);
    };

    const handleEdit = (mistake: any) => {
        setNewMistake({
            title: mistake.title,
            severity: mistake.severity,
            description: mistake.description || ''
        });
        setEditingId(mistake.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this mistake?')) {
            deleteMistake.mutate(id);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-body">
            {/* Elite Header */}
            <div className="relative p-12 bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/50 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-110" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-rose-200 transition-transform group-hover:-rotate-6">
                            <AlertOctagon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 border-none leading-none uppercase">My Trading Mistakes</h1>
                            <SubHeading className="mt-2 text-rose-600">Track and fix the mistakes that lose you money.</SubHeading>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowBlueprints(!showBlueprints)}
                            className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 shadow-sm hover:border-rose-600 transition-all font-heading"
                        >
                            <LayoutGrid size={18} />
                            Common Mistakes
                        </button>
                        <button
                            onClick={() => {
                                setIsAdding(true);
                                setEditingId(null);
                                setNewMistake({ title: '', severity: 'MEDIUM', description: '' });
                            }}
                            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 shadow-2xl hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all font-heading"
                        >
                            <Plus size={18} />
                            Add Mistake
                        </button>
                    </div>
                </div>
            </div>

            {/* Blueprints Modal */}
            <Modal
                isOpen={showBlueprints}
                onClose={() => setShowBlueprints(false)}
                title="Standard Trading Errors"
                maxWidth="5xl"
            >
                <div className="space-y-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Select common mistakes to start tracking them</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {MISTAKE_BLUEPRINTS.map((blueprint, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    addMistake.mutate({ title: blueprint.title, severity: blueprint.severity as any, description: blueprint.description });
                                    setShowBlueprints(false);
                                }}
                                className="p-6 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 rounded-2xl flex flex-col items-start gap-4 transition-all group/btn text-left"
                            >
                                <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center group-hover/btn:bg-rose-600 transition-all text-slate-400 group-hover/btn:text-white">
                                    <Plus size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-rose-400 mb-2">{blueprint.severity}</p>
                                    <p className="text-sm font-bold leading-tight text-slate-700">{blueprint.title}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Metric Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HighlightCard
                    label="Money Lost to Mistakes"
                    value={formatCurrency(stats.totalLost)}
                    sub="Total cost of bad habits"
                    icon={<TrendingDown className="text-rose-500" />}
                    variant="rose"
                />
                <HighlightCard
                    label="Big Problems"
                    value={stats.criticalCount}
                    sub="Issues that need fixing now"
                    icon={<ShieldAlert className="text-amber-500" />}
                    variant="amber"
                />
                <HighlightCard
                    label="Mistakes Tracked"
                    value={mistakes.length}
                    sub="Bad patterns being watched"
                    icon={<Activity className="text-indigo-500" />}
                    variant="indigo"
                />
            </div>

            <Modal
                isOpen={isAdding}
                onClose={() => { setIsAdding(false); setEditingId(null); }}
                title={editingId ? 'Edit Mistake Audit' : 'Define New Leak'}
                maxWidth="2xl"
            >
                <form onSubmit={handleAddMistake} className="space-y-8 leading-none">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Mistake Identifier</label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g., Revenge Trading"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-lg font-bold outline-none focus:bg-white focus:border-rose-500 transition-all text-slate-900"
                                value={newMistake.title}
                                onChange={e => setNewMistake({ ...newMistake, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Severity Impact</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-lg font-bold outline-none focus:bg-white focus:border-rose-500 transition-all text-slate-900 appearance-none"
                                value={newMistake.severity}
                                onChange={e => setNewMistake({ ...newMistake, severity: e.target.value as any })}
                            >
                                <option value="LOW">Low Impact</option>
                                <option value="MEDIUM">Medium Risk</option>
                                <option value="HIGH">High Risk</option>
                                <option value="CRITICAL">Very Dangerous</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button type="submit" className="w-full py-5 bg-rose-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-slate-900 transition-all">
                            {editingId ? 'Update Audit Protocol' : 'Begin Tracking Leak'}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mistakesWithStats.length === 0 ? (
                    <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-200 rounded-[4rem] bg-slate-50/50">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Target size={32} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your performance is clean. No mistakes found.</p>
                        <button onClick={() => setShowBlueprints(true)} className="mt-8 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-rose-500 text-[10px] font-bold uppercase shadow-sm hover:border-rose-500 transition-all font-heading">Select Common Mistakes</button>
                    </div>
                ) : (
                    mistakesWithStats.map((leak: any) => (
                        <LeakCard
                            key={leak.id}
                            leak={leak}
                            onEdit={() => handleEdit(leak)}
                            onDelete={() => handleDelete(leak.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function HighlightCard({ label, value, sub, icon, variant }: any) {
    const colors = {
        rose: "border-rose-100 bg-rose-50/30",
        amber: "border-amber-100 bg-amber-50/30",
        indigo: "border-indigo-100 bg-indigo-50/30",
    };

    return (
        <div className={cn("p-10 border rounded-[3rem] shadow-sm flex items-center justify-between transition-all hover:scale-[1.02] group", colors[variant as keyof typeof colors])}>
            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
                <p className="text-4xl font-bold tracking-tighter text-slate-900 leading-none">{value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase opacity-60 leading-none">{sub}</p>
            </div>
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-inner border border-slate-100/50 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    );
}

function LeakCard({ leak, onEdit, onDelete }: { leak: any, onEdit: () => void, onDelete: () => void }) {
    const isLethal = leak.severity === 'CRITICAL' || leak.severity === 'HIGH';

    return (
        <div className="group relative bg-white border border-slate-200 rounded-[3.5rem] p-10 hover:border-rose-500 transition-all duration-500 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8 leading-none">
                <div className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-bold uppercase shadow-sm",
                    isLethal ? "bg-rose-500 text-white shadow-rose-100" : "bg-slate-100 text-slate-600"
                )}>
                    {leak.severity === 'CRITICAL' ? 'Very Dangerous' : leak.severity}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div>
                    <h4 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors uppercase leading-tight mb-2">{leak.title}</h4>
                    <p className="text-[11px] font-bold text-slate-600 uppercase opacity-60 tracking-tight">Recurring Bad Habit</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-500 uppercase opacity-60 mb-2">Money Lost</p>
                        <p className="text-2xl font-bold tracking-tighter text-rose-500">{formatCurrency(leak.totalCost)}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-500 uppercase opacity-60 mb-2">Times Done</p>
                        <p className="text-2xl font-bold tracking-tighter text-slate-900">{leak.tradeCount}x</p>
                    </div>
                </div>
            </div>

            <div className="mt-10 p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group/fix min-h-[140px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 opacity-0 group-hover/fix:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Zap size={14} className="text-amber-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">What to do next</span>
                    </div>
                    <p className="text-[11px] font-bold uppercase leading-relaxed text-white/90">
                        {leak.severity === 'CRITICAL' ? 'Stop trading immediately. Review your rules.' :
                            leak.severity === 'HIGH' ? 'Take a 1-hour break and relax.' :
                                'Think about why this happened and update your plan.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
