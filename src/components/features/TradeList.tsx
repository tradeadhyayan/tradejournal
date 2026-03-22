import { useState, useMemo } from 'react';
import type { Trade } from '@/types';
import { formatCurrency } from '@/lib/stats';
import { useTrades } from '@/hooks/useTrades';
import { Trash2, Calendar, Tag, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortField = 'date' | 'instrument' | 'net_pnl';
type SortOrder = 'asc' | 'desc';

interface TradeListProps {
    trades: Trade[];
}

export function TradeList({ trades }: TradeListProps) {
    const { deleteTrade } = useTrades();
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedTrades = useMemo(() => {
        return [...trades].sort((a, b) => {
            let comparison = 0;
            if (sortField === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (sortField === 'instrument') {
                comparison = a.instrument.localeCompare(b.instrument);
            } else if (sortField === 'net_pnl') {
                comparison = a.net_pnl - b.net_pnl;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [trades, sortField, sortOrder]);

    if (!trades.length) {
        return (
            <div className="text-center py-20 px-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[3rem]">
                <p className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px] italic">Zero Records Found • Commencing Execution</p>
            </div>
        );
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown size={12} className="opacity-20 group-hover:opacity-100 transition-opacity" />;
        return sortOrder === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />;
    };

    return (
        <div className="bg-white/40 backdrop-blur-3xl border border-indigo-500/10 rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-indigo-500/5">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="px-8 py-6 text-[10px] font-bold uppercase">Flux</th>
                            <th
                                className="px-8 py-6 text-[10px] font-bold uppercase cursor-pointer group"
                                onClick={() => handleSort('instrument')}
                            >
                                <div className="flex items-center gap-2">Asset <SortIcon field="instrument" /></div>
                            </th>
                            <th
                                className="px-8 py-6 text-[10px] font-bold uppercase cursor-pointer group"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center gap-2">Time Delta <SortIcon field="date" /></div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase text-right">Size</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase text-right">Price Matrix</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase text-right">Risk</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase text-right">Tax</th>
                            <th
                                className="px-8 py-6 text-[10px] font-bold uppercase text-right cursor-pointer group"
                                onClick={() => handleSort('net_pnl')}
                            >
                                <div className="flex items-center justify-end gap-2 text-indigo-100">Delta P/L <SortIcon field="net_pnl" /></div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase text-center">Kill</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-500/10">
                        {sortedTrades.map((trade) => (
                            <tr key={trade.id} className="hover:bg-indigo-500/5 transition-all group">
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "px-3 py-1 rounded-[14px] text-[10px] font-bold uppercase shadow-sm",
                                        trade.direction === 'LONG' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                    )}>
                                        {trade.direction === 'LONG' ? 'Buy' : 'Sell'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm tracking-tight italic">{trade.instrument}</span>
                                        <span className="text-[10px] text-indigo-500/50 font-bold uppercase ">{trade.asset_class}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-xs text-indigo-900/60 font-bold italic">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="opacity-40" />
                                        {new Date(trade.date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right font-bold text-xs text-indigo-900">
                                    {trade.quantity}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex flex-col text-xs font-bold">
                                        <span className="text-indigo-500/40 italic">@{trade.entry_price}</span>
                                        <span className="text-indigo-900 italic">@{trade.exit_price}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-xs font-bold text-rose-500 italic">
                                        {trade.stop_loss ? `₹${trade.stop_loss}` : '---'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-xs font-bold text-indigo-500/40 italic">
                                        ₹{trade.fees || 0}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className={cn(
                                        "text-sm font-bold tracking-tighter italic",
                                        trade.net_pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        {trade.net_pnl >= 0 ? '+' : ''}{formatCurrency(trade.net_pnl)}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <button
                                        onClick={() => {
                                            if (confirm('Permanently delete this terminal entry?')) {
                                                deleteTrade.mutate(trade.id);
                                            }
                                        }}
                                        className="p-3 text-indigo-200 group-hover:text-rose-500 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
