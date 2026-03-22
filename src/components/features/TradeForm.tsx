import { useState, useEffect } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { useStrategies } from '@/hooks/useStrategies';
import { useMistakes } from '@/hooks/useMistakes';
import { cn } from '@/lib/utils';
import { X, Zap, ArrowRight, ShieldAlert, Coins, LineChart, BarChart, Activity, Sparkles, Wallet, Calendar, Plus, HeartCrack } from 'lucide-react';
import type { Trade } from '@/types';
import { getRealQuantity } from '@/lib/stats';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { SubHeading } from '@/components/ui/SubHeading';

interface TradeFormProps {
    onClose: () => void;
    editTrade?: Trade;
    onSuccess?: () => void;
}

const ASSET_CLASSES = [
    { label: 'Index', value: 'INDEX', icon: <BarChart size={14} /> },
    { label: 'Stocks', value: 'STOCKS', icon: <LineChart size={14} /> },
    { label: 'Commodities', value: 'COMMODITIES', icon: <Coins size={14} /> },
    { label: 'Futures', value: 'FUTURES', icon: <Activity size={14} /> },
    { label: 'Crypto', value: 'CRYPTO', icon: <Zap size={14} /> },
];

export function TradeForm({ onClose, editTrade, onSuccess }: TradeFormProps) {
    const { addTrade, updateTrade } = useTrades();
    const { strategies } = useStrategies();
    const { mistakes } = useMistakes();
    const { user, profile, refreshProfile } = useAuth();

    const [formData, setFormData] = useState({
        date: editTrade ? new Date(editTrade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        instrument: editTrade?.instrument || '',
        asset_class: editTrade?.asset_class || 'INDEX',
        direction: (editTrade?.direction || 'LONG') as 'LONG' | 'SHORT',
        entry_price: editTrade?.entry_price ? editTrade.entry_price.toString() : '',
        exit_price: editTrade?.exit_price ? editTrade.exit_price.toString() : '',
        stop_loss: editTrade?.stop_loss ? editTrade.stop_loss.toString() : '',
        quantity: editTrade?.quantity ? editTrade.quantity.toString() : '',
        fees: editTrade?.fees ? editTrade.fees.toString() : '',
        emotion: editTrade?.emotion || 'CALM',
        strategy: editTrade?.strategy || 'BREAKOUT',
        tags: editTrade?.tags?.join(', ') || '',
        notes: editTrade?.notes || '',
        initial_capital: profile?.initial_capital ? profile.initial_capital.toString() : '100000',
        mistake_ids: editTrade?.mistake_ids || [] as string[],
    });

    const [pnl, setPnl] = useState({ gross: 0, net: 0, rMultiple: 0 });

    useEffect(() => {
        const entry = parseFloat(formData.entry_price) || 0;
        const exit = parseFloat(formData.exit_price) || 0;
        const sl = parseFloat(formData.stop_loss) || 0;
        const rawQty = parseFloat(formData.quantity) || 0;
        const fees = parseFloat(formData.fees) || 0;

        const qty = getRealQuantity(formData.instrument, rawQty);

        if (entry && exit && qty) {
            const gross = formData.direction === 'LONG'
                ? (exit - entry) * qty
                : (entry - exit) * qty;

            let rMultiple = 0;
            if (sl > 0 && sl !== entry) {
                const riskPerUnit = formData.direction === 'LONG'
                    ? Math.abs(entry - sl)
                    : Math.abs(sl - entry);
                const rewardPerUnit = formData.direction === 'LONG' ? (exit - entry) : (entry - exit);
                rMultiple = rewardPerUnit / riskPerUnit;
            }

            setPnl({ gross, net: gross - fees, rMultiple });
        } else {
            setPnl({ gross: 0, net: 0, rMultiple: 0 });
        }
    }, [formData.entry_price, formData.exit_price, formData.stop_loss, formData.quantity, formData.fees, formData.direction, formData.instrument]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const entry = parseFloat(formData.entry_price);
        const exit = parseFloat(formData.exit_price);
        const rawQty = parseFloat(formData.quantity);
        const cap = parseFloat(formData.initial_capital);

        if (isNaN(entry) || isNaN(exit) || isNaN(rawQty)) {
            alert("Please enter valid numbers for Price and Quantity.");
            return;
        }

        const qty = getRealQuantity(formData.instrument, rawQty);
        const fees = parseFloat(formData.fees) || 0;
        const gross = formData.direction === 'LONG' ? (exit - entry) * qty : (entry - exit) * qty;
        const net = gross - fees;

        const payload = {
            date: new Date(formData.date).toISOString(),
            instrument: formData.instrument.toUpperCase().trim(),
            asset_class: formData.asset_class as any,
            direction: formData.direction,
            entry_price: entry,
            exit_price: exit,
            stop_loss: parseFloat(formData.stop_loss) || 0,
            quantity: qty,
            fees: fees,
            emotion: formData.emotion,
            strategy: formData.strategy,
            gross_pnl: gross,
            net_pnl: net,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            notes: formData.notes,
            mistake_ids: formData.mistake_ids,
        };

        try {
            if (!isNaN(cap) && user) {
                await supabase.from('users').update({ initial_capital: cap }).eq('id', user.id);
                await refreshProfile();
            }

            if (editTrade) {
                await updateTrade.mutateAsync({ id: editTrade.id, updates: payload });
            } else {
                await addTrade.mutateAsync(payload);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Trade save error:", error);
            alert(`Save Failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleMistake = (id: string) => {
        setFormData(prev => ({
            ...prev,
            mistake_ids: prev.mistake_ids.includes(id)
                ? prev.mistake_ids.filter(mId => mId !== id)
                : [...prev.mistake_ids, id]
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto no-scrollbar font-body">
                <div className="sticky top-0 z-10 p-12 border-b border-slate-50 flex items-center justify-between bg-white/90 backdrop-blur-3xl">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl relative overflow-hidden group">
                            <Plus className="w-10 h-10 text-white" />
                            <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <SubHeading>Terminal Entry</SubHeading>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none uppercase">{editTrade ? 'Edit Record' : 'Log execution'}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-12">
                    <div className="space-y-6">
                        <SubHeading>Asset Category</SubHeading>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {ASSET_CLASSES.map((asset) => (
                                <button
                                    key={asset.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, asset_class: asset.value as any }))}
                                    className={cn(
                                        "flex flex-col items-center gap-4 py-6 rounded-3xl border transition-all duration-500",
                                        formData.asset_class === asset.value
                                            ? "bg-slate-900 text-white border-slate-900 shadow-2xl"
                                            : "bg-slate-50 border-slate-50 text-slate-300 hover:border-indigo-200 hover:text-indigo-600 hover:bg-white"
                                    )}
                                >
                                    {asset.icon}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{asset.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <SubHeading>Instrument</SubHeading>
                            <input type="text" name="instrument" required placeholder="SBIN, NIFTY..." value={formData.instrument} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-8 text-[12px] font-black uppercase tracking-widest focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-900 shadow-sm" />
                        </div>
                        <div className="space-y-3">
                            <SubHeading>Time Stamp</SubHeading>
                            <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-8 text-[12px] font-black uppercase tracking-widest focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-900 shadow-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <SubHeading>Bias</SubHeading>
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, direction: 'LONG' }))} className={cn("py-5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all", formData.direction === 'LONG' ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" : "bg-slate-50 text-slate-300")}>Buy</button>
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, direction: 'SHORT' }))} className={cn("py-5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all", formData.direction === 'SHORT' ? "bg-rose-600 text-white shadow-xl shadow-rose-100" : "bg-slate-50 text-slate-300")}>Sell</button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <SubHeading>Protocol</SubHeading>
                            <select name="strategy" value={formData.strategy} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-8 text-[12px] font-black uppercase tracking-widest focus:border-indigo-500 focus:bg-white outline-none shadow-sm appearance-none">
                                <option value="BREAKOUT">Breakout</option>
                                <option value="SCALPING">Scalping</option>
                                <option value="TREND">Trend Following</option>
                                {strategies.map(s => <option key={s.id} value={s.name.toUpperCase()}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <InputGroup label="Nav In" name="entry_price" value={formData.entry_price} onChange={handleChange} />
                        <InputGroup label="Nav Out" name="exit_price" value={formData.exit_price} onChange={handleChange} />
                        <InputGroup label="Abort SL" name="stop_loss" value={formData.stop_loss} onChange={handleChange} isRed />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <InputGroup label="Quantum" name="quantity" value={formData.quantity} onChange={handleChange} />
                        <InputGroup label="Tax / Toll" name="fees" value={formData.fees} onChange={handleChange} isRed />
                    </div>

                    {/* Mistakes Section */}
                    {mistakes.length > 0 && (
                        <div className="space-y-6">
                            <SubHeading className="text-rose-500">Psychology Audit</SubHeading>
                            <div className="flex flex-wrap gap-3">
                                {mistakes.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => toggleMistake(m.id)}
                                        className={cn(
                                            "px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border transition-all duration-500",
                                            formData.mistake_ids.includes(m.id)
                                                ? "bg-rose-600 text-white border-rose-600 shadow-xl shadow-rose-100"
                                                : "bg-white border-slate-100 text-slate-300 hover:border-rose-200 hover:text-rose-500 shadow-sm"
                                        )}
                                    >
                                        {m.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-8 pt-6">
                        <div className="p-10 bg-slate-900 text-white border border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <SubHeading className="text-white/40">Efficiency</SubHeading>
                                    <p className="text-4xl font-black tracking-tighter">{pnl.rMultiple.toFixed(2)}X</p>
                                </div>
                                <div className="text-right">
                                    <SubHeading className="text-white/40">Projection</SubHeading>
                                    <p className="text-4xl font-black tracking-tighter">₹{pnl.net.toFixed(0)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <button type="button" onClick={onClose} className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-[10px] border border-slate-100">Cancel</button>
                            <button type="submit" className="flex-[2] py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-4">
                                {editTrade ? 'Update Protocol' : 'Sync Execution'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputGroup({ label, name, value, onChange, isRed = false, isBlue = false, icon }: any) {
    return (
        <div className="space-y-4">
            <SubHeading className={cn(
                "ml-1 flex items-center gap-3",
                isRed ? "text-rose-500" : isBlue ? "text-indigo-600" : ""
            )}>
                {icon}{label}
            </SubHeading>
            <input
                type="number"
                step="0.01"
                name={name}
                value={value}
                onChange={onChange}
                className={cn(
                    "w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-8 text-sm font-black focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-sm",
                    isRed && "bg-rose-50 border-rose-50 text-rose-600",
                    isBlue && "bg-indigo-50 border-indigo-50 text-indigo-600"
                )}
            />
        </div>
    );
}
