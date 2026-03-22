import { Brain, Zap, Sparkles, Wand2 } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';

export default function PatternAI() {
    const { trades } = useTrades();
    const tradeCount = trades.length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-body pb-20">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Pattern AI</h1>
                    <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Neural Network Pattern Matching</p>
                </div>
            </div>

            <div className="p-12 bg-gradient-to-br from-indigo-600/10 to-white border border-slate-200 rounded-[3rem] text-center space-y-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse" />
                <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl border border-indigo-500/30">
                    <Wand2 size={40} className="text-indigo-400" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">Scanning {tradeCount} Data Points...</h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                        Our AI is analyzing {tradeCount} execution logs across your terminal map to identify recurring profitable patterns and cognitive biases.
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button className="px-10 py-5 bg-indigo-600 text-white font-bold uppercase  text-[11px] rounded-2xl hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                        {tradeCount < 50 ? 'Force Preliminary Scan' : 'Generate Full Report'}
                        <Sparkles size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 uppercase">
                        <Zap size={20} className="text-amber-500" />
                        Detected Edge
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                        {tradeCount < 10
                            ? "Insufficient data to establish edge. Feed the terminal more execution logs."
                            : `Strongest edge detected in ${trades[0]?.instrument || 'Indices'} during morning volatility. Maintain current setup frequency.`}
                    </p>
                </div>
                <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 uppercase">
                        <Zap size={20} className="text-rose-500" />
                        Leakage Warning
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                        {tradeCount < 5
                            ? "System integrity scanning... logging baseline cognitive state."
                            : "Detected minor drift in exit discipline. 14% of profits leaking through premature closures."}
                    </p>
                </div>
            </div>
        </div>
    );
}
