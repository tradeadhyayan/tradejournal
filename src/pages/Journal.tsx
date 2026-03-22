import { useState, useMemo } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats, formatCurrency } from '@/lib/stats';
import {
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    StickyNote,
    Plus,
    Calendar,
    Target,
    Activity,
    ChevronDown,
    Trash2,
    Edit3,
    MoreHorizontal,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    Table as TableIcon,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TradeForm } from '@/components/features/TradeForm';
import { ImportTerminal } from '@/components/features/ImportTerminal';
import type { Trade } from '@/types';
import * as XLSX from 'xlsx';

export default function Journal() {
    const { trades, deleteTrade, addTrade } = useTrades();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [editingTrade, setEditingTrade] = useState<Trade | undefined>();
    const [assetFilter, setAssetFilter] = useState('ALL');
    const [viewMode, setViewMode] = useState<'LIST' | 'TABLE'>('LIST');

    const filteredTrades = useMemo(() => {
        return trades.filter(t => {
            const matchesSearch = t.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesAsset = assetFilter === 'ALL' || t.asset_class === assetFilter;
            return matchesSearch && matchesAsset;
        });
    }, [trades, searchTerm, assetFilter]);

    const handleEdit = (trade: Trade) => {
        setEditingTrade(trade);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this trade logic?')) {
            await deleteTrade.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-['Quicksand'] bg-[var(--app-bg)] min-h-screen p-6 md:p-10">
            {/* Header Card */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white border border-slate-200 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-950 leading-none mb-2">Trade Journal</h1>
                    <p className="text-slate-500 font-medium text-sm">Systematic record of your trading performance.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mr-2">
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'LIST' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('TABLE')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'TABLE' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <TableIcon size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase  transition-all shadow-sm border border-transparent",
                            isTerminalOpen
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        )}
                    >
                        {isTerminalOpen ? <X size={16} /> : <Upload size={16} />}
                        {isTerminalOpen ? "Close Import" : "Import Trades"}
                    </button>

                    <button
                        onClick={() => { setEditingTrade(undefined); setIsFormOpen(true); }}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase  shadow-lg shadow-indigo-200/50 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Log Trade
                    </button>
                </div>
            </div>

            {/* Stats Summary Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-800 delay-100">
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] transition-all hover:shadow-md group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Activity size={18} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Performance</span>
                    </div>
                    <p className={cn("text-3xl font-bold font-heading", (calculateStats(trades).netPnl) >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {(calculateStats(trades).netPnl) >= 0 ? '+' : ''}{formatCurrency(calculateStats(trades).netPnl)}
                    </p>
                </div>
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] transition-all hover:shadow-md group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors"><Target size={18} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Win Rate</span>
                    </div>
                    <p className="text-3xl font-bold font-heading text-slate-900">{calculateStats(trades).winRate.toFixed(1)}%</p>
                </div>
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] transition-all hover:shadow-md group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Calendar size={18} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Samples</span>
                    </div>
                    <p className="text-3xl font-bold font-heading text-slate-900">{calculateStats(trades).totalTrades} <span className="text-sm text-slate-400 font-bold uppercase ml-1">Trades</span></p>
                </div>
            </div>

            {/* Inline Import Terminal */}
            {isTerminalOpen && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <ImportTerminal onComplete={() => setIsTerminalOpen(false)} />
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by symbol or tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-14 pr-8 text-sm font-bold text-indigo-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={assetFilter}
                            onChange={(e) => setAssetFilter(e.target.value)}
                            className="px-8 py-4 bg-white border border-slate-200 rounded-3xl text-xs font-bold text-indigo-900 uppercase  outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer appearance-none shadow-[0_2px_10px_rgb(0,0,0,0.02)] min-w-[160px]"
                        >
                            <option value="ALL">All Assets</option>
                            <option value="INDEX">Index</option>
                            <option value="STOCKS">Stocks</option>
                            <option value="COMMODITIES">Commodities</option>
                            <option value="CRYPTO">Crypto</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Trade List/Table Container */}
            <div className="space-y-3">
                {filteredTrades.length === 0 ? (
                    <div className="p-20 text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                            <StickyNote size={24} />
                        </div>
                        <div>
                            <p className="text-indigo-900 font-bold text-lg">Journal is empty</p>
                            <p className="text-slate-500 text-sm mt-1">Start by logging your first trade setup.</p>
                        </div>
                    </div>
                ) : (
                    viewMode === 'LIST' ? (
                        <div className="grid grid-cols-1 gap-3 px-1">
                            {/* Header Row (Hidden on mobile) */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-2 text-[10px] font-bold text-slate-400 uppercase">
                                <div className="col-span-4 pl-4">Entry Information</div>
                                <div className="col-span-2 text-center">Setup</div>
                                <div className="col-span-2 text-center">Status</div>
                                <div className="col-span-2 text-right">Net Realized</div>
                                <div className="col-span-2 text-center">Manage</div>
                            </div>

                            {filteredTrades.map((trade) => (
                                <div key={trade.id} className="group bg-white p-1 rounded-3xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all border border-slate-100 hover:border-indigo-100">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4">
                                        <div className="col-span-4 flex items-center gap-5">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold shadow-sm shrink-0 transition-transform group-hover:scale-105",
                                                trade.net_pnl >= 0
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-rose-50 text-rose-600"
                                            )}>
                                                <span>{trade.direction === 'LONG' ? 'BUY' : 'SELL'}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-indigo-950 leading-tight">{trade.instrument}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                                                        {new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase ">{trade.asset_class}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-center hidden md:block">
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/50 pointer-events-none">
                                                {trade.strategy}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex justify-center">
                                            <span className={cn(
                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase  flex items-center gap-2",
                                                trade.net_pnl >= 0
                                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                                            )}>
                                                {trade.net_pnl >= 0 ? "Profit" : "Loss"}
                                            </span>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "text-lg font-bold tracking-tight",
                                                    trade.net_pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                                                )}>
                                                    {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex justify-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(trade)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"><Edit3 size={14} /></button>
                                            <button onClick={() => handleDelete(trade.id)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in duration-500">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date / Instrument</th>
                                            <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategy</th>
                                            <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Entry</th>
                                            <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Exit</th>
                                            <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">P&L</th>
                                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredTrades.map((trade) => (
                                            <tr key={trade.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-bold text-indigo-950">{trade.instrument}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">{new Date(trade.date).toLocaleDateString()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={cn(
                                                        "text-[9px] font-black px-2 py-1 rounded-md uppercase",
                                                        trade.direction === 'LONG' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                                    )}>
                                                        {trade.direction === 'LONG' ? 'BUY' : 'SELL'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-sm font-bold text-slate-600">{trade.strategy}</td>
                                                <td className="px-6 py-6 text-sm font-bold text-slate-900 text-right">{formatCurrency(trade.entry_price)}</td>
                                                <td className="px-6 py-6 text-sm font-bold text-slate-900 text-right">{formatCurrency(trade.exit_price)}</td>
                                                <td className="px-6 py-6 text-right">
                                                    <span className={cn(
                                                        "text-sm font-bold",
                                                        trade.net_pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                                                    )}>
                                                        {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => handleEdit(trade)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={12} /></button>
                                                        <button onClick={() => handleDelete(trade.id)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={12} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}
            </div>

            {isFormOpen && (
                <TradeForm
                    onClose={() => { setIsFormOpen(false); setEditingTrade(undefined); }}
                    editTrade={editingTrade}
                />
            )}
        </div>
    );
}
