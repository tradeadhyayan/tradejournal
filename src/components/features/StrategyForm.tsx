import { useState } from 'react';
import { useStrategies } from '@/hooks/useStrategies';
import { X, Target, Save, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategyFormProps {
    onClose: () => void;
}

export function StrategyForm({ onClose }: StrategyFormProps) {
    const { addStrategy } = useStrategies();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE' as const,
        risk_per_trade: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addStrategy.mutateAsync(formData);
            alert("New Strategy Architecture Committed.");
            onClose();
        } catch (error: any) {
            alert(`Architecture Failed: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white leading-none">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Target className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tighter text-slate-900 uppercase leading-none">Architect</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase  mt-2">{formData.name || 'Protocol Definition'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase  text-slate-400 ml-4">Setup Identifier</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. VCP Breakout"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-900"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase  text-slate-400 ml-4">Edge Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe the professional logic..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-5 px-6 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-900 resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-50 rounded-xl text-xs font-bold uppercase  text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >Discard</button>
                        <button
                            type="submit"
                            disabled={addStrategy.isPending}
                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-3 shadow-lg hover:bg-slate-900 transition-all "
                        >
                            {addStrategy.isPending ? 'Committing...' : 'Commit Architecture'}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
