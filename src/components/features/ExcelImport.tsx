import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useTrades } from '@/hooks/useTrades';
import { Loader2, CheckCircle2, AlertCircle, Download, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export function ExcelImport({ onComplete }: { onComplete?: () => void }) {
    const { user } = useAuth();
    const { addTrade } = useTrades();
    const queryClient = useQueryClient();
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const headers = "Date,Instrument,Direction,Entry,Exit,Quantity,AssetClass,Strategy,Tags,Notes\n";
        const sample = "2026-01-20,NIFTY,LONG,23450.50,23510.00,50,INDEX,BREAKOUT,\"Breakout, Volume\",Strong momentum\n";
        const blob = new Blob([headers + sample], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'trade_adhyayan_template.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsImporting(true);
        setStatus(null);
        setProgress({ current: 0, total: 0 });

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const dataBuffer = evt.target?.result as ArrayBuffer;
                const wb = XLSX.read(dataBuffer, { type: 'array' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data: any[] = XLSX.utils.sheet_to_json(ws);

                if (!data || data.length === 0) {
                    throw new Error('The file seems to be empty.');
                }

                setProgress({ current: 0, total: data.length });

                // Helper to find key case-insensitively
                const getVal = (obj: any, ...keys: string[]) => {
                    for (const key of keys) {
                        const targetKey = Object.keys(obj).find(
                            k => k.toLowerCase().replace(/[\s_]/g, '') === key.toLowerCase().replace(/[\s_]/g, '')
                        );
                        if (targetKey && obj[targetKey] !== undefined && obj[targetKey] !== null && obj[targetKey] !== '') {
                            return obj[targetKey];
                        }
                    }
                    return undefined;
                };

                let successCount = 0;
                let failCount = 0;

                // Process in sequence to avoid overloading
                for (let i = 0; i < data.length; i++) {
                    const row: any = data[i];
                    try {
                        const entry = Number(getVal(row, 'entry', 'entryprice', 'buyprice', 'entry_price') || 0);
                        const exit = Number(getVal(row, 'exit', 'exitprice', 'sellprice', 'exit_price') || 0);
                        const qty = Number(getVal(row, 'quantity', 'qty', 'lot', 'lots') || 1);
                        const dirRaw = String(getVal(row, 'direction', 'side', 'type', 'action') || 'LONG').toUpperCase();

                        // Handle various direction formats
                        let dir = 'LONG';
                        if (dirRaw.includes('SHORT') || dirRaw.includes('SELL')) {
                            dir = 'SHORT';
                        } else if (dirRaw.includes('LONG') || dirRaw.includes('BUY')) {
                            dir = 'LONG';
                        }

                        const calculatedPnl = dir === 'LONG' ? (exit - entry) * qty : (entry - exit) * qty;

                        await addTrade.mutateAsync({
                            date: getVal(row, 'date', 'tradedate', 'datetime') || new Date().toISOString(),
                            instrument: String(getVal(row, 'instrument', 'symbol', 'stock', 'scrip') || 'UNKNOWN').toUpperCase(),
                            direction: dir as any,
                            entry_price: entry,
                            exit_price: exit,
                            quantity: qty,
                            asset_class: String(getVal(row, 'assetclass', 'segment', 'market', 'asset_class') || 'STOCKS').toUpperCase() as any,
                            gross_pnl: Number(getVal(row, 'grosspnl', 'pnl', 'profit', 'gross_pnl') || calculatedPnl),
                            net_pnl: Number(getVal(row, 'netpnl', 'net', 'netprofit', 'net_pnl') || calculatedPnl),
                            fees: Number(getVal(row, 'fees', 'charges', 'brokerage', 'commission') || 0),
                            stop_loss: Number(getVal(row, 'stoploss', 'sl', 'stop_loss') || 0),
                            emotion: String(getVal(row, 'emotion', 'mood', 'feeling') || 'CALM').toUpperCase(),
                            tags: getVal(row, 'tags', 'labels') ? String(getVal(row, 'tags', 'labels')).split(',').map((t: string) => t.trim()) : [],
                            notes: getVal(row, 'notes', 'comments', 'remarks', 'description') || '',
                            strategy: getVal(row, 'strategy', 'setup', 'plan') || 'Imported',
                        });
                        successCount++;
                    } catch (err) {
                        console.error('Row failed:', err);
                        failCount++;
                    }
                    setProgress(prev => ({ ...prev, current: i + 1 }));
                }

                // Force a full refetch
                await queryClient.invalidateQueries({ queryKey: ['trades', user.id] });

                setStatus({
                    type: 'success',
                    message: `Import Complete! ${successCount} trades synced successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`
                });

                if (onComplete) {
                    setTimeout(onComplete, 2000);
                }
            } catch (error: any) {
                setStatus({ type: 'error', message: error.message || 'File processing failed.' });
            } finally {
                setIsImporting(false);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div>
                    <h3 className="text-2xl font-bold mb-1 font-heading">Bulk Trade Import</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Import from Excel/CSV</p>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-3 px-6 py-3 bg-[var(--app-bg)]/50 border border-[var(--app-border)] rounded-2xl text-[10px] font-bold uppercase  hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-indigo-400"
                >
                    <Download size={14} />
                    Download Template
                </button>
            </div>

            <div
                onClick={() => !isImporting && fileInputRef.current?.click()}
                className={cn(
                    "relative border-4 border-dashed border-[var(--app-border)] rounded-[2.5rem] p-16 text-center transition-all cursor-pointer group hover:bg-indigo-500/5 hover:border-indigo-500/30",
                    isImporting && "opacity-50 pointer-events-none"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                />

                <div className="flex flex-col items-center">
                    {isImporting ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <Loader2 className="w-20 h-20 text-indigo-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                                    {Math.round((progress.current / progress.total) * 100)}%
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase  animate-pulse">
                                Importing {progress.current} of {progress.total} trades...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                                <Upload className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h4 className="font-extrabold text-xl mb-3">Drop Your Trade File</h4>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium mb-6">
                                Upload Excel (.xlsx, .xls) or CSV file with your trade history. We'll automatically detect and import your data.
                            </p>
                            <div className="bg-[var(--app-bg)]/50 border border-[var(--app-border)] rounded-xl p-4 max-w-md">
                                <p className="text-xs font-bold text-slate-600 mb-2">Supported Columns (flexible names):</p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                                    <span>• Date, Instrument</span>
                                    <span>• Direction (Buy/Sell)</span>
                                    <span>• Entry, Exit</span>
                                    <span>• Quantity</span>
                                    <span>• Asset Class</span>
                                    <span>• Strategy, Tags</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {status && (
                <div className={cn(
                    "mt-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500",
                    status.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                )}>
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        status.type === 'success' ? "bg-emerald-500/20" : "bg-rose-500/20"
                    )}>
                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <p className="text-xs font-bold uppercase  leading-loose">{status.message}</p>
                </div>
            )}
        </div>
    );
}
