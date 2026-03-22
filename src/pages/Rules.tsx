import { ShieldCheck, LayoutGrid, Plus, Activity, ListChecks, Info, Target, Check, Shield, Tag, AlertCircle, Trash2 } from 'lucide-react';
import { SubHeading } from '@/components/ui/SubHeading';
import { Modal } from '@/components/ui/Modal';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRules, Rule } from '@/hooks/useRules';
import { useAuth } from '@/context/AuthContext';
import { RULE_BLUEPRINTS } from '@/lib/blueprints';

export default function Rules() {
    const { profile, updateStreak } = useAuth();
    const { rules, addRule, toggleRule, toggleIsDaily, deleteRule, isLoading } = useRules();
    const [newRuleData, setNewRuleData] = useState({ text: '', category: 'GENERAL', priority: 'P2' });
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [showBlueprints, setShowBlueprints] = useState(false);

    const dailyRules = rules.filter(r => r.is_daily);
    const dailyCompletedCount = dailyRules.filter(r => r.completed).length;
    const allDailyCompleted = dailyRules.length > 0 && dailyCompletedCount === dailyRules.length;

    useEffect(() => {
        if (allDailyCompleted) {
            const lastCompleted = profile?.last_rules_completed_at;
            const today = new Date().toISOString().split('T')[0];
            const wasCompletedToday = lastCompleted?.startsWith(today);

            if (!wasCompletedToday) {
                const currentStreak = profile?.daily_streak || 0;
                updateStreak(currentStreak + 1);
            }
        }
    }, [allDailyCompleted, profile?.last_rules_completed_at, profile?.daily_streak, updateStreak]);

    const handleAddRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRuleData.text.trim()) return;
        await addRule.mutateAsync(newRuleData);
        setNewRuleData({ text: '', category: 'GENERAL', priority: 'P2' });
        setIsAdding(false);
    };

    const filteredRules = rules.filter(r => filter === 'ALL' || (filter === 'DAILY' ? r.is_daily : r.category === filter));
    const completedCount = rules.filter(r => r.completed).length;
    const progress = (completedCount / (rules.length || 1)) * 100;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-body pb-20">
            {/* Elite Header */}
            <div className="relative p-12 bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-110" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-200 transition-transform group-hover:rotate-3">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 border-none leading-none">My Trading Rules</h1>
                            <SubHeading className="mt-2 text-indigo-600">Sync your rules daily to maintain your trading edge.</SubHeading>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowBlueprints(!showBlueprints)}
                            className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 shadow-sm hover:border-indigo-600 transition-all"
                        >
                            <LayoutGrid size={18} />
                            Select Premade Rules
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 shadow-2xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus size={18} />
                            Add Custom Rule
                        </button>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <HighlightCard
                    label="Discipline Streak"
                    value={`${profile?.daily_streak || 0} ${profile?.daily_streak === 1 ? 'Day' : 'Days'}`}
                    sub="Consecutive days followed"
                    icon={<Activity className="text-rose-500" />}
                    variant="rose"
                />
                <HighlightCard
                    label="Daily Checklist"
                    value={`${dailyCompletedCount}/${dailyRules.length}`}
                    sub="Priority rules for today"
                    icon={<ListChecks className="text-indigo-500" />}
                    variant="indigo"
                />
                <HighlightCard
                    label="Overall Compliance"
                    value={`${progress.toFixed(0)}%`}
                    sub="Rule followed score"
                    icon={<Shield className="text-emerald-500" />}
                    variant="emerald"
                />
                <div className="p-10 bg-slate-50 border border-slate-200 rounded-[3rem] shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-relaxed italic opacity-80">
                            "A trade without rules is a gamble."
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filter */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm space-y-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Show Rules By</p>
                        <div className="flex flex-col gap-2">
                            {['ALL', 'DAILY', 'RISK', 'MINDSET', 'EXECUTION', 'GENERAL'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={cn(
                                        "px-6 py-4 rounded-2xl text-[11px] font-bold transition-all text-left flex items-center justify-between group",
                                        filter === cat
                                            ? "bg-slate-900 text-white shadow-xl translate-x-1"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                    )}
                                >
                                    {cat}
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-lg",
                                        filter === cat ? "bg-white/20" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400"
                                    )}>
                                        {cat === 'ALL' ? rules.length : cat === 'DAILY' ? dailyRules.length : rules.filter(r => r.category === cat).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rules List */}
                <div className="lg:col-span-3 space-y-4">
                    <Modal
                        isOpen={isAdding}
                        onClose={() => setIsAdding(false)}
                        title="Create Custom Rule"
                        maxWidth="3xl"
                    >
                        <form onSubmit={handleAddRule} className="space-y-8 leading-none">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Rule Description</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newRuleData.text}
                                    onChange={(e) => setNewRuleData({ ...newRuleData, text: e.target.value })}
                                    placeholder="e.g., Do not trade after 3:00 PM"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-lg font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all text-slate-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SelectField label="Category" value={newRuleData.category} onChange={v => setNewRuleData({ ...newRuleData, category: v })} options={['GENERAL', 'RISK', 'MINDSET', 'EXECUTION']} />
                                <SelectField label="Priority" value={newRuleData.priority} onChange={v => setNewRuleData({ ...newRuleData, priority: v })} options={['P1', 'P2', 'P3']} />
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all">
                                    Secure My Protocol
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {(filter === 'ALL' ? rules : filter === 'DAILY' ? dailyRules : rules.filter(r => r.category === filter)).length === 0 && !isAdding && (
                        <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[4rem] bg-slate-50/50">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <Target size={32} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No rules found in this category.</p>
                            <button onClick={() => setShowBlueprints(true)} className="mt-8 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-indigo-600 text-[10px] font-bold uppercase shadow-sm hover:border-indigo-600 transition-all">Use Quick Templates</button>
                        </div>
                    )}


                    <div className="grid grid-cols-1 gap-4">
                        {(filter === 'ALL' ? rules : filter === 'DAILY' ? dailyRules : rules.filter(r => r.category === filter)).map(rule => (
                            <RuleItem
                                key={rule.id}
                                rule={rule}
                                onToggle={() => toggleRule.mutate({ id: rule.id, completed: !rule.completed })}
                                onToggleDaily={() => (toggleIsDaily as any).mutate({ id: rule.id, isDaily: !rule.is_daily })}
                                onDelete={() => deleteRule.mutate(rule.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function HighlightCard({ label, value, sub, icon, variant }: any) {
    const colors = {
        emerald: "border-emerald-100 bg-emerald-50/30",
        indigo: "border-indigo-100 bg-indigo-50/30",
        rose: "border-rose-100 bg-rose-50/30",
    };

    return (
        <div className={cn("p-10 border rounded-[3rem] shadow-sm flex items-center justify-between transition-all hover:scale-[1.02] group", colors[variant as keyof typeof colors])}>
            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
                <p className="text-3xl font-bold tracking-tighter text-slate-900 leading-none">{value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase opacity-60 leading-none">{sub}</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-inner border border-slate-100/50 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    );
}

function RuleItem({ rule, onToggle, onToggleDaily, onDelete }: any) {
    const isP1 = rule.priority === 'P1' || rule.priority === 'P1 (High)';

    return (
        <div className={cn(
            "group p-8 border rounded-[3rem] flex items-center justify-between transition-all duration-300",
            rule.completed ? "bg-emerald-50/40 border-emerald-100 opacity-60" : "bg-white border-slate-100 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5"
        )}>
            <div className="flex items-center gap-8 flex-1 cursor-pointer" onClick={onToggle}>
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                    rule.completed ? "bg-emerald-500 text-white" : "bg-slate-50 border border-slate-200 text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-600"
                )}>
                    {rule.completed ? <Check size={24} /> : <Shield size={20} />}
                </div>
                <div>
                    <h4 className={cn("text-xl font-bold tracking-tight mb-2 uppercase leading-none transition-all", rule.completed ? "text-emerald-700/80 line-through" : "text-slate-900 group-hover:text-indigo-600")}>{rule.text}</h4>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase opacity-60 bg-slate-100 px-3 py-1 rounded-lg"><Tag size={10} /> {rule.category}</span>
                        {isP1 && <span className="flex items-center gap-2 text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-3 py-1 rounded-lg animate-pulse"><AlertCircle size={10} /> CRITICAL</span>}
                        {rule.is_daily && <span className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase bg-indigo-50 px-3 py-1 rounded-lg"><Activity size={10} /> DAILY</span>}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleDaily(); }}
                    className={cn(
                        "px-6 py-4 rounded-2xl text-[10px] font-bold uppercase transition-all flex items-center gap-2",
                        rule.is_daily
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                >
                    <Activity size={14} />
                    {rule.is_daily ? "Daily Active" : "Set Daily"}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-4 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
}

function SelectField({ label, value, onChange, options }: any) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest leading-none mb-4">{label}</p>
            <div className="flex gap-2">
                {options.map((opt: string) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className={cn(
                            "px-6 py-3 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap",
                            value === opt ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200"
                        )}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

