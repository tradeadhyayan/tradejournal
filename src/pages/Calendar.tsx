import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, TrendingUp, TrendingDown, Target, Zap, Clock, MessageSquare, X } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { useEvents } from '@/hooks/useEvents';
import { formatCurrency } from '@/lib/stats';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SubHeading } from '@/components/ui/SubHeading';

export default function Calendar() {
    const { trades } = useTrades();
    const { events, addEvent, deleteEvent } = useEvents();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', type: 'NOTE' as any, description: '' });

    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();

    const tradesByDate = useMemo(() => {
        const grouped: Record<string, { net_pnl: number, count: number }> = {};
        trades.forEach(t => {
            const dateStr = new Date(t.date).toISOString().split('T')[0];
            if (!grouped[dateStr]) grouped[dateStr] = { net_pnl: 0, count: 0 };
            grouped[dateStr].net_pnl += t.net_pnl;
            grouped[dateStr].count += 1;
        });
        return grouped;
    }, [trades]);

    const eventsByDate = useMemo(() => {
        const grouped: Record<string, typeof events> = {};
        events.forEach(e => {
            const dateStr = new Date(e.date).toISOString().split('T')[0];
            if (!grouped[dateStr]) grouped[dateStr] = [];
            grouped[dateStr].push(e);
        });
        return grouped;
    }, [events]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
        setSelectedDay(null);
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDay || !newEvent.title) return;

        const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        await addEvent.mutateAsync({
            ...newEvent,
            date: dateStr
        });
        setNewEvent({ title: '', type: 'NOTE', description: '' });
        setShowEventForm(false);
    };

    const selectedDateStr = selectedDay ? `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : null;
    const selectedDayTrades = selectedDateStr ? tradesByDate[selectedDateStr] : null;
    const selectedDayEvents = selectedDateStr ? eventsByDate[selectedDateStr] || [] : [];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in fade-in duration-700 pb-20 font-body">
            {/* Main Calendar View */}
            <div className="xl:col-span-3 space-y-10">
                <div className="relative p-12 bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-110" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-200 transition-transform group-hover:-rotate-6">
                                <CalendarIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-bold tracking-tighter text-slate-900 border-none leading-none uppercase">Execution Ledger</h1>
                                <SubHeading className="mt-2 text-indigo-600 uppercase">Track your discipline and market events.</SubHeading>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-2xl shadow-inner">
                            <button onClick={handlePrevMonth} className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-indigo-600"><ChevronLeft size={24} /></button>
                            <span className="text-sm font-black px-6 text-slate-900 uppercase tracking-widest">{month} {year}</span>
                            <button onClick={handleNextMonth} className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-indigo-600"><ChevronRight size={24} /></button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-xl relative overflow-hidden">
                    <div className="grid grid-cols-7 gap-4 mb-10">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square opacity-20" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayData = tradesByDate[dateStr];
                            const isSelected = selectedDay === day;
                            const hasEvents = eventsByDate[dateStr]?.length > 0;

                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={cn(
                                        "aspect-square p-4 rounded-[2rem] flex flex-col justify-between transition-all cursor-pointer relative group border-2",
                                        isSelected ? "bg-slate-900 border-slate-900 shadow-2xl scale-105 z-10" : "bg-slate-50/50 border-slate-100 hover:border-indigo-400 hover:bg-white hover:shadow-xl"
                                    )}
                                >
                                    <span className={cn(
                                        "text-xs font-black tracking-tighter transition-colors",
                                        isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                                    )}>{day}</span>

                                    <div className="flex flex-col items-end gap-1.5 leading-none">
                                        {dayData && (
                                            <div className={cn(
                                                "px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tight",
                                                dayData.net_pnl >= 0 ?
                                                    (isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                                                    (isSelected ? "bg-rose-500/20 text-rose-400" : "bg-rose-50 text-rose-600")
                                            )}>
                                                {dayData.net_pnl >= 0 ? '+' : ''}{Math.round(dayData.net_pnl)}
                                            </div>
                                        )}
                                        {hasEvents && (
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isSelected ? "bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" : "bg-indigo-600"
                                            )} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Side Panel: Events & Details */}
            <div className="xl:col-span-1 space-y-8">
                <div className="p-10 bg-slate-900 rounded-[3rem] shadow-2xl text-white relative overflow-hidden min-h-[400px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={140} /></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight uppercase">Daily Brief</h2>
                            {selectedDay && (
                                <button
                                    onClick={() => setShowEventForm(true)}
                                    className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg"
                                >
                                    <Plus size={18} />
                                </button>
                            )}
                        </div>

                        {!selectedDay ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                <Clock size={40} />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed px-4">Select a day to view <br />execution & events</p>
                            </div>
                        ) : (
                            <div className="space-y-10 flex-1">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{month} {selectedDay}, {year}</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold tracking-tighter">
                                            {selectedDayTrades ? formatCurrency(selectedDayTrades.net_pnl) : '₹0'}
                                        </span>
                                        <span className="text-[10px] font-bold text-white/40 uppercase">Day P/L</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-white/60">{selectedDayTrades?.count || 0} Trades Executed</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Target size={16} className="text-indigo-400" />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Market Events</h3>
                                    </div>

                                    <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                                        {selectedDayEvents.length === 0 ? (
                                            <p className="text-[10px] text-white/30 italic">No events recorded for this session.</p>
                                        ) : (
                                            selectedDayEvents.map(event => (
                                                <div key={event.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl group relative">
                                                    <button
                                                        onClick={() => deleteEvent.mutate(event.id)}
                                                        className="absolute top-4 right-4 text-white/20 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            event.type === 'ECONOMIC' ? "bg-rose-500" : event.type === 'MILESTONE' ? "bg-indigo-500" : "bg-slate-500"
                                                        )} />
                                                        <p className="text-xs font-black uppercase tracking-tight truncate pr-4">{event.title}</p>
                                                    </div>
                                                    <p className="text-[10px] text-white/50 leading-relaxed font-medium">{event.description}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center gap-3 text-slate-400 mb-6">
                        <Zap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Protocol Stats</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-slate-900 leading-none">{trades.filter(t => t.net_pnl > 0).length}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Green Days</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-slate-900 leading-none">{trades.filter(t => t.net_pnl <= 0 && t.net_pnl !== 0).length}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Red Days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEventForm(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">New Event</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Record session notes or news</p>
                            </div>
                            <button onClick={() => setShowEventForm(false)} className="p-3 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleAddEvent} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Event Title</label>
                                <input
                                    autoFocus
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="e.g. FED Interest Rate Decision"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Event Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['ECONOMIC', 'NOTE', 'MILESTONE'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewEvent({ ...newEvent, type })}
                                            className={cn(
                                                "py-4 rounded-xl text-[9px] font-black uppercase transition-all border",
                                                newEvent.type === type ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-400"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Brief Context</label>
                                <textarea
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[120px]"
                                    placeholder="Impact analysis or session observations..."
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-600 transition-all">
                                Protocol Entry Confirmed
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
