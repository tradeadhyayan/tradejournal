import { X, AlertTriangle, Brain, Target, ShieldAlert, Zap, TrendingDown, HeartCrack } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradersLossDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TradersLossDialog({ isOpen, onClose }: TradersLossDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 font-body">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-4 bg-slate-100 hover:bg-rose-500 hover:text-white rounded-2xl transition-all z-20 group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh] overflow-y-auto no-scrollbar">
                    {/* Visual Column */}
                    <div className="relative p-12 bg-slate-900 text-white flex flex-col justify-center overflow-hidden min-h-[400px]">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 blur-3xl rounded-full -mr-40 -mt-40" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 blur-3xl rounded-full -ml-40 -mb-40" />

                        <div className="relative z-10 space-y-8">
                            <div className="w-20 h-20 bg-rose-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-rose-500/20">
                                <AlertTriangle className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-5xl font-bold tracking-tighter leading-none mb-4 uppercase italic">The Brutal <br />Truth</h2>
                                <p className="text-rose-400 font-bold uppercase text-[10px] tracking-[0.3em]">Why 95% of active traders fail</p>
                            </div>

                            <div className="space-y-4 pt-10">
                                <InsightItem
                                    icon={<TrendingDown size={18} />}
                                    label="Emotional Capital"
                                    value="Traders run out of patience before they run out of money."
                                />
                                <InsightItem
                                    icon={<ShieldAlert size={18} />}
                                    label="Risk Blindness"
                                    value="Treating the market like a casino instead of a business."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="p-12 md:p-16 space-y-12 bg-white">
                        <div className="space-y-8">
                            <SectionHeader title="The Psychology Gap" icon={<Brain className="text-indigo-600" />} />
                            <p className="text-slate-600 leading-relaxed font-bold uppercase text-[12px] opacity-80 italic">
                                The human brain is wired for survival, not for probability. In trading, survival instincts lead to:
                            </p>
                            <ul className="space-y-6">
                                <LossReason
                                    title="Loss Aversion"
                                    desc="Holding losers too long hoping they come back, but cutting winners too early to 'lock in' small gains."
                                    impact="Destroys your Risk:Reward ratio."
                                />
                                <LossReason
                                    title="Recency Bias"
                                    desc="Focusing on the last 3-4 trades instead of the next 100. This leads to revenge trading or setup hesitation."
                                    impact="Breaks your system consistency."
                                />
                                <LossReason
                                    title="Position Size Ego"
                                    desc="Trading too big for your account. One loss wipes out 10 wins, making it mathematically impossible to recover."
                                    impact="Instant account blow-up risk."
                                />
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Zap className="text-amber-500 fill-amber-500" size={24} />
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Protocol Sync: Verified</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
                            >
                                I Understand the Risk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">{title}</h3>
        </div>
    );
}

function LossReason({ title, desc, impact }: { title: string, desc: string, impact: string }) {
    return (
        <li className="group">
            <h4 className="flex items-center gap-3 text-sm font-black text-rose-600 uppercase tracking-tight mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {title}
            </h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-1">{desc}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase italic tracking-widest leading-none mt-2">Critical Impact: {impact}</p>
        </li>
    );
}

function InsightItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
            <div className="text-rose-400 mt-1">{icon}</div>
            <div>
                <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">{label}</p>
                <p className="text-xs font-medium text-white/80 leading-snug">{value}</p>
            </div>
        </div>
    );
}
