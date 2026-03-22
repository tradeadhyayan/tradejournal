import { useState } from 'react';
import { Settings, Calculator, Scale, Target, Activity, ArrowRight, Zap, TrendingUp, BarChart2, Wallet, Plus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SubHeading } from '@/components/ui/SubHeading';

export default function Tools() {
    const [positionSize, setPositionSize] = useState({
        capital: '100000',
        riskPercent: '1',
        entry: '',
        sl: '',
        result: 0,
        riskAmount: 0
    });

    const [compoundStats, setCompoundStats] = useState({
        initial: '100000',
        monthly: '10',
        period: '12',
        result: 0
    });

    const [simulator, setSimulator] = useState({
        winRate: '50',
        avgRR: '2',
        trades: '50',
        initial: '100000',
        risk: '1'
    });

    const [simData, setSimData] = useState<any[]>([]);

    const calculateSize = () => {
        const cap = parseFloat(positionSize.capital);
        const riskP = parseFloat(positionSize.riskPercent);
        const entry = parseFloat(positionSize.entry);
        const sl = parseFloat(positionSize.sl);

        if (cap && riskP && entry && sl && entry !== sl) {
            const riskAmt = cap * (riskP / 100);
            const riskPerUnit = Math.abs(entry - sl);
            const qty = riskAmt / riskPerUnit;
            setPositionSize(prev => ({ ...prev, result: qty, riskAmount: riskAmt }));
        }
    };

    const calculateCompound = () => {
        let total = parseFloat(compoundStats.initial);
        const rate = parseFloat(compoundStats.monthly) / 100;
        const months = parseInt(compoundStats.period);

        if (total && rate && months) {
            for (let i = 0; i < months; i++) {
                total *= (1 + rate);
            }
            setCompoundStats(prev => ({ ...prev, result: total }));
        }
    };

    const runSimulation = () => {
        const wr = parseFloat(simulator.winRate) / 100;
        const rr = parseFloat(simulator.avgRR);
        const totalTrades = parseInt(simulator.trades);
        let cap = parseFloat(simulator.initial);
        const riskPercent = parseFloat(simulator.risk) / 100;

        const data = [{ name: 'Start', equity: cap }];

        for (let i = 1; i <= totalTrades; i++) {
            const isWin = Math.random() < wr;
            const riskAmt = cap * riskPercent;
            if (isWin) {
                cap += riskAmt * rr;
            } else {
                cap -= riskAmt;
            }
            data.push({ name: `T${i}`, equity: cap });
        }
        setSimData(data);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-body">
            {/* Elite Header */}
            <div className="relative p-12 bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-110" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-200 transition-transform group-hover:-rotate-6">
                            <Calculator className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 border-none">Trading Tools</h1>
                            <SubHeading className="mt-2 text-indigo-600">Calculators to manage your risk and plan your growth</SubHeading>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Position Size Calculator */}
                <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm flex flex-col group transition-all duration-500 hover:border-indigo-400">
                    <div className="flex items-center justify-between mb-10 leading-none">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Scale size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Position Size</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Plan your entry</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <ToolInput label="Capital (₹)" value={positionSize.capital} onChange={(v) => setPositionSize({ ...positionSize, capital: v })} />
                        <ToolInput label="Risk (%)" value={positionSize.riskPercent} onChange={(v) => setPositionSize({ ...positionSize, riskPercent: v })} />
                        <ToolInput label="Entry Price" value={positionSize.entry} onChange={(v) => setPositionSize({ ...positionSize, entry: v })} placeholder="0.00" />
                        <ToolInput label="Stop Loss" value={positionSize.sl} onChange={(v) => setPositionSize({ ...positionSize, sl: v })} placeholder="0.00" isRed />
                    </div>

                    <button
                        onClick={calculateSize}
                        className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold uppercase text-[10px] flex items-center justify-center gap-4 shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
                    >
                        Calculate Size <ArrowRight size={16} />
                    </button>

                    {positionSize.result > 0 && (
                        <div className="mt-10 p-10 bg-indigo-50 border border-indigo-100 rounded-[3rem] grid grid-cols-2 gap-8 animate-in zoom-in-95 leading-none">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 opacity-60">Resulting Qty</p>
                                <p className="text-4xl font-bold tracking-tighter text-indigo-600">{Math.floor(positionSize.result)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 opacity-60">Money at Risk</p>
                                <p className="text-3xl font-bold tracking-tighter text-rose-500">₹{positionSize.riskAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Compound Growth Calculator */}
                <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm flex flex-col group transition-all duration-500 hover:border-emerald-400">
                    <div className="flex items-center justify-between mb-10 leading-none">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Compound ROI</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Growth projection</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="col-span-2">
                            <ToolInput label="Initial Amount (₹)" value={compoundStats.initial} onChange={(v) => setCompoundStats({ ...compoundStats, initial: v })} />
                        </div>
                        <ToolInput label="Monthly ROI (%)" value={compoundStats.monthly} onChange={(v) => setCompoundStats({ ...compoundStats, monthly: v })} />
                        <ToolInput label="Duration (Months)" value={compoundStats.period} onChange={(v) => setCompoundStats({ ...compoundStats, period: v })} />
                    </div>

                    <button
                        onClick={calculateCompound}
                        className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold uppercase text-[10px] flex items-center justify-center gap-4 shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
                    >
                        Predict Growth <Zap size={16} />
                    </button>

                    {compoundStats.result > 0 && (
                        <div className="mt-10 p-10 bg-emerald-50 border border-emerald-100 rounded-[3rem] animate-in slide-in-from-bottom-5 leading-none">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 opacity-60">Final Valuation</p>
                            <p className="text-4xl font-bold text-emerald-600 tracking-tighter">₹{Math.floor(compoundStats.result).toLocaleString()}</p>
                            <div className="mt-6 pt-6 border-t border-emerald-100/50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Efficiency</span>
                                <span className="text-lg font-bold text-emerald-600">+{((compoundStats.result / parseFloat(compoundStats.initial) - 1) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Edge Simulator */}
                <div className="lg:col-span-2 p-16 bg-white border border-slate-200 rounded-[5rem] shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all duration-500">
                    <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                        <div className="w-full lg:w-1/3 space-y-12">
                            <div className="flex items-center gap-6 leading-none">
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-200">
                                    <BarChart2 size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tighter text-slate-900 uppercase">Simulator</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Test your strategy's edge</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <ToolInput label="Win Rate (%)" value={simulator.winRate} onChange={(v) => setSimulator({ ...simulator, winRate: v })} />
                                <ToolInput label="Avg R:R Ratio" value={simulator.avgRR} onChange={(v) => setSimulator({ ...simulator, avgRR: v })} />
                                <ToolInput label="Number of Trades" value={simulator.trades} onChange={(v) => setSimulator({ ...simulator, trades: v })} />
                                <button onClick={runSimulation} className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-bold uppercase text-[11px] shadow-2xl hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-95">Run Monte Carlo Simulation</button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-[4rem] p-12 border border-slate-100 shadow-inner flex flex-col justify-center min-h-[500px]">
                            {simData.length > 0 ? (
                                <div className="h-full w-full">
                                    <div className="h-80 w-full mb-12">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={simData}>
                                                <defs>
                                                    <linearGradient id="simColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="name" hide />
                                                <YAxis hide domain={['auto', 'auto']} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                                                />
                                                <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#simColor)" animationDuration={1000} strokeLinecap="round" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-between items-center px-10 leading-none">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Final Balance</p>
                                            <p className="text-4xl font-bold tracking-tighter text-slate-900">₹{Math.floor(simData[simData.length - 1].equity).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Total Delta</p>
                                            <p className={cn("text-4xl font-bold tracking-tighter", simData[simData.length - 1].equity > parseFloat(simulator.initial) ? "text-emerald-500" : "text-rose-500")}>
                                                {simData[simData.length - 1].equity > parseFloat(simulator.initial) ? '+' : ''}{((simData[simData.length - 1].equity / parseFloat(simulator.initial) - 1) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-300 gap-6 opacity-40">
                                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100">
                                        <Activity size={48} className="animate-pulse" />
                                    </div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-center">Ready to simulate your performance edge...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolInput({ label, value, onChange, placeholder, isRed = false }: any) {
    return (
        <div className="space-y-3 leading-none">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-3 opacity-60 tracking-tight">{label}</label>
            <input
                type="number"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-lg font-bold focus:outline-none focus:bg-white focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300",
                    isRed && "border-rose-100 focus:border-rose-500"
                )}
            />
        </div>
    );
}
