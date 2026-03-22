import React, { useRef, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useTrades } from '@/hooks/useTrades';
import { useStrategies } from '@/hooks/useStrategies';
import { useImports } from '@/hooks/useImports';
import {
    Loader2, CheckCircle2, AlertCircle, Download, Upload,
    ClipboardPaste, History, Trash2, LayoutGrid, ArrowRight,
    Database, Copy, Check, Wallet, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { getRealQuantity } from '@/lib/stats';
import { supabase } from '@/lib/supabase';

type ImportMode = 'FILE' | 'QUICK_PASTE' | 'HISTORY';

export function ImportTerminal({ onComplete }: { onComplete?: () => void }) {
    const { user, profile, refreshProfile } = useAuth();
    const { addTrade } = useTrades();
    const { strategies } = useStrategies();
    const { imports, createImport, updateImport, deleteImport, isLoading: isImportsLoading } = useImports();
    const queryClient = useQueryClient();

    const defaultCap = profile?.initial_capital || 100000;
    const [batchCapital, setBatchCapital] = useState(defaultCap.toString());

    useEffect(() => {
        if (profile?.initial_capital) {
            setBatchCapital(profile.initial_capital.toString());
        }
    }, [profile?.initial_capital]);

    const [mode, setMode] = useState<ImportMode>('QUICK_PASTE');
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'warning'; message: string; details?: string[] } | null>(null);
    const [isTableMissing, setIsTableMissing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [pasteRaw, setPasteRaw] = useState('');
    const [parsedPreview, setParsedPreview] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sqlCode = `-- COPY AND RUN THIS IN SUPABASE SQL EDITOR
CREATE TABLE IF NOT EXISTS public.trade_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT,
    total_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    fail_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.trades ADD COLUMN IF NOT EXISTS import_id UUID REFERENCES public.trade_imports(id) ON DELETE CASCADE;
ALTER TABLE public.trade_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own imports" ON public.trade_imports FOR ALL USING (auth.uid() = user_id);`;

    const copySQL = () => {
        navigator.clipboard.writeText(sqlCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (!pasteRaw.trim()) {
            setParsedPreview([]);
            return;
        }

        const lines = pasteRaw.trim().split('\n');
        const preview = lines.map(line => {
            let parts = line.split(/[\t,]/).map(p => p.trim());
            if (parts.length < 5) {
                parts = line.trim().split(/\s{2,}/).map(p => p.trim());
                if (parts.length < 5) {
                    parts = line.trim().split(/\s+/).map(p => p.trim());
                }
            }

            if (parts.length < 5) return null;

            const slValue = parseFloat(parts[6] || '');
            const rawAsset = (parts[7] || 'INDEX').toUpperCase();
            const strategy = (parts[8] || 'UNDEFINED').toUpperCase();
            const notes = parts[9] || '';

            return {
                date: parts[0],
                instrument: parts[1],
                direction: parts[2],
                entry: parts[3],
                exit: parts[4],
                qty: parseFloat(parts[5] || '1'),
                sl: isNaN(slValue) ? 0 : slValue,
                asset: rawAsset,
                strategy: strategy,
                notes: notes,
                is_sl_missing: isNaN(slValue) || slValue === 0
            };
        }).filter(Boolean);

        setParsedPreview(preview);
    }, [pasteRaw]);

    const downloadTemplate = () => {
        const headers = "Date,Instrument,Side,Entry,Exit,Quantity,StopLoss,AssetClass,Setup,Notes\n";
        const sample = "2026-01-25,NIFTY,BUY,24500,24550,1,24400,INDEX,BREAKOUT,Strong trend\n";
        const blob = new Blob([headers + sample], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'trade_adhyayan_sync_format.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const runImportBatch = async (rows: any[], filename: string) => {
        setIsImporting(true);
        setStatus(null);

        let batchId: string | undefined;
        try {
            const cap = parseFloat(batchCapital);
            if (!isNaN(cap) && user) {
                await supabase.from('users').update({ initial_capital: cap } as never).eq('id', user.id);
                await refreshProfile();
            }

            const importRecord = await createImport.mutateAsync({
                filename,
                total_count: rows.length,
                success_count: 0,
                fail_count: 0
            }).catch(e => {
                if (e.message.toLowerCase().includes('not found') || e.message.toLowerCase().includes('trade_imports')) {
                    setIsTableMissing(true);
                    throw new Error("DATABASE TABLE MISSING");
                }
                throw e;
            });

            batchId = importRecord.id;
            setProgress({ current: 0, total: rows.length });
            let successes = 0;
            const errors: string[] = [];


            // Helper for case-insensitive and flexible key extraction
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

            for (let i = 0; i < rows.length; i++) {
                try {
                    const row = rows[i];

                    // Use getVal for robust extraction
                    const entry = parseFloat(getVal(row, 'entry', 'entryprice', 'buy', 'price') || '0');
                    const exit = parseFloat(getVal(row, 'exit', 'exitprice', 'sell', 'target') || '0');
                    const rawQty = parseFloat(getVal(row, 'qty', 'quantity', 'lots', 'size') || '1');
                    const sl = parseFloat(getVal(row, 'sl', 'stoploss', 'stop') || '0');

                    const sideRaw = String(getVal(row, 'direction', 'side', 'type', 'action', 'buy/sell') || 'BUY').toUpperCase();
                    const dir = (sideRaw.includes('SELL') || sideRaw.startsWith('S') || sideRaw === 'SHORT') ? 'SHORT' : 'LONG';

                    const rawInstrument = String(getVal(row, 'instrument', 'symbol', 'script', 'asset') || 'UNKNOWN').toUpperCase();
                    const rawAssetClass = String(getVal(row, 'asset', 'assetclass', 'segment', 'market') || 'INDEX').toUpperCase();
                    const rawNotes = String(getVal(row, 'notes', 'comment', 'remark', 'desc') || '');

                    const qty = getRealQuantity(rawInstrument, rawQty);
                    const calculatedPnl = dir === 'LONG' ? (exit - entry) * qty : (entry - exit) * qty;

                    let dateStr = getVal(row, 'date', 'time', 'datetime', 'day');
                    if (dateStr && typeof dateStr === 'string' && (dateStr.includes('-') || dateStr.includes('/'))) {
                        const separator = dateStr.includes('-') ? '-' : '/';
                        const parts = dateStr.split(separator);
                        // Handle DD-MM-YYYY format by flipping to YYYY-MM-DD
                        if (parts[0].length <= 2 && parts[2].length === 4) {
                            dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        }
                    }

                    const parsedDate = new Date(dateStr || Date.now());
                    const validDate = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

                    // --- SMART STRATEGY DETECTION ---
                    let strategyInput = String(getVal(row, 'strategy', 'setup', 'plan', 'pattern') || '').trim();
                    let finalStrategy = 'UNDEFINED';
                    let matchedStrategy = null;

                    // 1. Try exact match on input column
                    if (strategyInput) {
                        matchedStrategy = strategies.find((s: any) => s.name.toLowerCase() === strategyInput.toLowerCase());
                    }

                    // 2. If no match or input empty, scan NOTES for known strategy names
                    if (!matchedStrategy) {
                        matchedStrategy = strategies.find((s: any) => rawNotes.toLowerCase().includes(s.name.toLowerCase()));
                    }

                    if (matchedStrategy) {
                        finalStrategy = matchedStrategy.name;
                    } else if (strategyInput) {
                        finalStrategy = strategyInput.toUpperCase();
                    }

                    await addTrade.mutateAsync({
                        date: validDate,
                        instrument: rawInstrument,
                        direction: dir,
                        entry_price: entry,
                        exit_price: exit,
                        quantity: qty,
                        stop_loss: sl,
                        asset_class: rawAssetClass as any,
                        gross_pnl: calculatedPnl,
                        net_pnl: calculatedPnl,
                        fees: 0,
                        emotion: 'UNDEFINED',
                        strategy: finalStrategy,
                        tags: sl === 0 ? ['Missing SL'] : [],
                        notes: rawNotes || (sl === 0 ? 'TRADING ERROR: Missing SL' : 'Bulk Sync'),
                        import_id: batchId
                    });
                    successes++;
                } catch (e: any) {
                    errors.push(`Row ${i + 1}: ${e.message}`);
                }
                setProgress(prev => ({ ...prev, current: i + 1 }));
            }

            await updateImport.mutateAsync({
                id: batchId,
                updates: { success_count: successes, fail_count: errors.length }
            });

            await queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
            setStatus({
                type: successes > 0 ? (errors.length > 0 ? 'warning' : 'success') : 'error',
                message: `Journalized ${successes} trades successfully.`,
                details: errors
            });
        } catch (e: any) {
            if (e.message !== "DATABASE TABLE MISSING") {
                setStatus({ type: 'error', message: e.message });
            }
        } finally {
            setIsImporting(false);
        }
    };

    const handlePasteSync = async () => {
        if (!parsedPreview.length || !user) return;
        await runImportBatch(parsedPreview, 'Quick Paste');
    };

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const buffer = evt.target?.result as ArrayBuffer;
                const wb = XLSX.read(buffer, { type: 'array' });
                const mainSheet = wb.Sheets[wb.SheetNames[0]];
                const data: any[] = XLSX.utils.sheet_to_json(mainSheet);
                if (!data.length) throw new Error('File is empty.');
                await runImportBatch(data, file.name);
            } catch (error: any) {
                setStatus({ type: 'error', message: error.message });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    if (isTableMissing) {
        return (
            <div className="p-16 bg-rose-50 border-4 border-rose-100 rounded-[4rem] animate-in zoom-in-95 duration-500 font-body">
                <div className="max-w-2xl mx-auto space-y-10">
                    <div className="flex items-center gap-8 text-rose-500">
                        <Database size={64} className="animate-bounce" />
                        <div>
                            <h2 className="text-4xl font-bold italic tracking-tighter uppercase">Migration Sync Alert</h2>
                            <p className="text-[10px] font-bold uppercase text-rose-400 tracking-[0.4em] mt-2">Action Required: Tables Missing</p>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] shadow-xl space-y-6">
                        <p className="text-sm font-bold uppercase tracking-tight text-indigo-300">
                            The terminal cannot journalize imports because the <span className="text-indigo-600 italic">Trade Records</span> schema is missing.
                        </p>
                        <div className="relative group">
                            <pre className="bg-slate-900 text-slate-300 p-8 rounded-3xl text-[10px] font-mono leading-loose overflow-x-auto no-scrollbar">
                                {sqlCode}
                            </pre>
                            <button
                                onClick={copySQL}
                                className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white border border-white/10 shadow-xl"
                            >
                                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-['Quicksand']">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white border border-indigo-50 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-3xl font-bold tracking-tight text-indigo-950">Trade Import</h3>
                    <p className="text-xs font-bold text-indigo-400 uppercase ">Synchronize your trading data from external sources.</p>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <TabButton active={mode === 'QUICK_PASTE'} onClick={() => setMode('QUICK_PASTE')} label="Clipboard Paste" icon={<ClipboardPaste size={16} />} />
                    <TabButton active={mode === 'FILE'} onClick={() => setMode('FILE')} label="Upload File" icon={<Upload size={16} />} />
                    <TabButton active={mode === 'HISTORY'} onClick={() => setMode('HISTORY')} label="Sync Logs" icon={<History size={16} />} />
                </div>
            </div>

            {mode === 'QUICK_PASTE' ? (
                <div className="space-y-10">
                    <div className="p-10 bg-white border border-indigo-50 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-12">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-indigo-950 uppercase  flex items-center gap-2">
                                        Paste Data Blocks
                                    </h4>
                                    <button
                                        onClick={downloadTemplate}
                                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-2 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
                                    >
                                        <Download size={12} /> Template
                                    </button>
                                </div>

                                {/* Instruction Guide */}
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-2">
                                    <p className="font-bold text-slate-700">How to copy from Excel/Sheets:</p>
                                    <ol className="list-decimal list-inside space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                                        <li>Select your columns in this exact order: <strong>Date, Symbol, Side, Entry, Exit, Qty, SL, Asset, Setup, Notes</strong></li>
                                        <li>Include multiple rows for bulk import.</li>
                                        <li>Press <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono text-[10px]">Ctrl+C</code> to copy.</li>
                                        <li>Paste directly into the box below.</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Visual Header Guide */}
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
                                <p className="text-[10px] font-bold uppercase text-indigo-400 mb-4  text-center">Required Column Sequence</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {['Date', 'Symbol', 'Side', 'Entry', 'Exit', 'Qty', 'SL', 'Asset', 'Setup', 'Notes'].map((h, i) => (
                                        <div key={h} className="text-center group relative">
                                            <div className="bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold py-2 px-4 rounded-lg shadow-sm min-w-[60px]">
                                                {h}
                                            </div>
                                            <div className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-indigo-50 text-[8px] flex items-center justify-center text-indigo-400 font-bold border border-indigo-100">{i + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                value={pasteRaw}
                                onChange={(e) => setPasteRaw(e.target.value)}
                                placeholder={`Example format:\n2025-01-26	XYZ_LTD	BUY	100.5	105.0	10	98.0	STOCKS	BREAKOUT	Good volume`}
                                className="w-full h-96 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-mono text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none shadow-inner transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {parsedPreview.length > 0 && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 pt-6 border-t border-dashed border-indigo-100">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-bold uppercase  text-indigo-900 flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        Ready to Import ({parsedPreview.length} entries)
                                    </h5>
                                </div>
                                <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-80 bg-white">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-3 text-[10px] font-bold uppercase ">Date / Asset</th>
                                                <th className="px-6 py-3 text-[10px] font-bold uppercase ">Symbol</th>
                                                <th className="px-6 py-3 text-[10px] font-bold uppercase ">Side</th>
                                                <th className="px-6 py-3 text-[10px] font-bold uppercase  text-right">Execution</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {parsedPreview.map((p, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-700">{p.date}</span>
                                                            <span className="text-[9px] text-indigo-400 font-bold uppercase ">{p.asset}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="font-bold text-xs uppercase text-slate-700">{p.instrument}</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded text-[9px] font-bold uppercase",
                                                            p.direction.toUpperCase().includes('BUY') || p.direction.toUpperCase().includes('LONG')
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-rose-50 text-rose-600"
                                                        )}>
                                                            {p.direction}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-mono text-xs text-slate-600">Γé╣{p.entry} ΓåÆ Γé╣{p.exit}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button
                                    onClick={handlePasteSync}
                                    disabled={isImporting}
                                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-xs  shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isImporting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                    Confirm Import
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : mode === 'FILE' ? (
                <div
                    onClick={() => !isImporting && fileInputRef.current?.click()}
                    className="p-20 border-2 border-dashed border-indigo-200 rounded-3xl text-center cursor-pointer hover:bg-indigo-50 transition-all group shadow-sm bg-white"
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx,.csv" />
                    <Upload className="w-16 h-16 text-indigo-200 mx-auto mb-6 group-hover:text-indigo-500 transition-all group-hover:scale-110" />
                    <h4 className="text-xl font-bold tracking-tight mb-2 text-indigo-900">Upload Data File</h4>
                    <p className="text-xs font-medium text-slate-400 mb-8">Supports .xlsx and .csv formats</p>
                    <button className="px-8 py-3 bg-white border border-indigo-200 text-[10px] font-bold uppercase  rounded-xl hover:border-indigo-400 transition-all shadow-sm flex items-center gap-2 mx-auto" onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}>
                        <Download size={14} /> Download Template
                    </button>
                </div>
            ) : (
                <ImportHistory imports={imports} isImportsLoading={isImportsLoading} deleteImport={deleteImport} />
            )}

            {status && <StatusIndicator status={status} />}
        </div>
    );
}

function TabButton({ active, onClick, label, icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn("px-10 py-5 rounded-[2rem] text-[10px] font-bold uppercase  transition-all flex items-center gap-4", active ? "bg-indigo-600 text-white shadow-2xl scale-105" : "text-indigo-500/60 hover:text-indigo-600")}
        >
            {icon && React.cloneElement(icon, { size: 20 })}{label}
        </button>
    );
}


function ImportHistory({ imports, isImportsLoading, deleteImport }: any) {
    return (
        <div className="space-y-8">
            {isImportsLoading ? (
                <div className="p-40 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600 w-16 h-16" /></div>
            ) : (
                imports.map((imp: any) => (
                    <div key={imp.id} className="p-8 bg-white/40 backdrop-blur-3xl border border-indigo-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between hover:border-indigo-500 transition-all group shadow-sm hover:shadow-xl hover:bg-white/60">
                        <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-indigo-100/50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                                <History size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-indigo-950 leading-tight">{imp.filename}</p>
                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    <span>{new Date(imp.created_at).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-emerald-600">{imp.success_count} Added</span>
                                    {imp.fail_count > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-rose-500">{imp.fail_count} Failed</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this import batch? All associated trades will be removed.")) {
                                    deleteImport.mutate(imp.id);
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:border-rose-500 text-xs font-bold uppercase w-full md:w-auto justify-center"
                        >
                            <Trash2 size={16} />
                            <span>Delete Batch</span>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

function StatusIndicator({ status }: any) {
    return (
        <div className={cn(
            "p-12 rounded-[4rem] border animate-in slide-in-from-top-12 duration-700 shadow-3xl backdrop-blur-3xl sticky bottom-10 z-[50] ring-1 ring-white/10",
            status.type === 'success' ? "bg-emerald-500/90 text-white border-emerald-400" : "bg-amber-500/90 text-white border-amber-400"
        )}>
            <div className="flex items-center gap-8">
                <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-3xl", status.type === 'success' ? "bg-white text-emerald-500" : "bg-white text-amber-500")}>
                    {status.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                </div>
                <div className="flex-1">
                    <p className="text-3xl font-bold italic tracking-tighter uppercase">{status.type === 'success' ? 'Sync Success' : 'Sync Warning'}</p>
                    <p className="text-[11px] font-bold uppercase  opacity-80 mt-1">{status.message}</p>
                </div>
                <button onClick={() => window.location.reload()} className="px-12 py-6 bg-white text-indigo-950 rounded-2xl text-[10px] font-bold uppercase  shadow-3xl hover:bg-black hover:text-white transition-all italic">Refresh Stream</button>
            </div>
        </div>
    );
}
