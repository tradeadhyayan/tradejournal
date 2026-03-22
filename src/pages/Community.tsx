import { useState } from 'react';
import {
    MessageSquare,
    Bell,
    Zap,
    TrendingUp,
    Trophy,
    ShieldCheck,
    MoreVertical,
    Flag,
    Mic,
    Send,
    Lock,
    Unlock,
    Info,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Channel = 'announcements' | 'daily-trades' | 'strategy-rooms' | 'review-highlights';

export default function Community() {
    const [activeChannel, setActiveChannel] = useState<Channel>('daily-trades');
    const [disciplineScore, setDisciplineScore] = useState(85); // Mock score
    const [hasPostingRights, setHasPostingRights] = useState(true);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in duration-500 font-body">
            <div className="flex flex-1 overflow-hidden">
                {/* Channel Sidebar */}
                <div className="w-72 border-r border-[var(--app-border)] bg-[var(--app-bg)]/30 flex flex-col p-6 space-y-8">
                    <div>
                        <h2 className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase mb-6 px-4">Community Channels</h2>
                        <div className="space-y-1">
                            <ChannelItem
                                active={activeChannel === 'announcements'}
                                icon={<Bell size={16} />}
                                label="Announcements"
                                onClick={() => setActiveChannel('announcements')}
                                mentorOnly
                            />
                            <ChannelItem
                                active={activeChannel === 'daily-trades'}
                                icon={<Zap size={16} />}
                                label="Daily trades"
                                onClick={() => setActiveChannel('daily-trades')}
                            />
                            <ChannelItem
                                active={activeChannel === 'strategy-rooms'}
                                icon={<TrendingUp size={16} />}
                                label="Strategy Rooms"
                                onClick={() => setActiveChannel('strategy-rooms')}
                            />
                            <ChannelItem
                                active={activeChannel === 'review-highlights'}
                                icon={<Trophy size={16} />}
                                label="Review Highlights"
                                onClick={() => setActiveChannel('review-highlights')}
                            />
                        </div>
                    </div>

                    <div className="flex-1" />

                    {/* Moderation Health */}
                    <div className="p-4 bg-indigo-50/5 border border-indigo-500/10 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-indigo-500">
                            <ShieldCheck size={14} />
                            <span className="text-[9px] font-bold uppercase ">Moderation Guard</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed">No buy/sell tips or P&L shaming allowed. AI-driven keyword detection active.</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                {activeChannel === 'daily-trades' ? <Zap size={20} /> : <MessageSquare size={20} />}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase ">#{activeChannel}</h3>
                                <p className="text-[10px] font-bold text-slate-400">1.2k Trading Operators Active</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 text-slate-400 hover:text-rose-500"><Flag size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-slate-900"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                        <Message
                            user="Mentor-Rohit"
                            time="10:32 AM"
                            text="Focus on the MEAN REVERSION setup today. Market is showing signs of overextension on the 15M time-frame."
                            isMentor
                        />
                        <Message
                            user="Trady-Arjun"
                            time="10:45 AM"
                            text="Entered Nifty 18200 PE on ORB Breakout. Standard risk taken."
                        />
                        <Message
                            user="System"
                            time="10:50 AM"
                            text="Reminder: Constructive feedback only. Avoid sharing MTM Screenshots."
                            isSystem
                        />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                        {hasPostingRights ? (
                            <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-3xl p-3 shadow-sm">
                                <button className="p-3 text-slate-400 hover:text-indigo-600"><Mic size={20} /></button>
                                <input
                                    type="text"
                                    placeholder={`Message #${activeChannel}...`}
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-2"
                                />
                                <button className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                                    <Send size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 bg-slate-100/50 rounded-3xl border border-dashed border-slate-300 flex items-center justify-center flex-col text-center">
                                <Lock className="text-slate-400 mb-3" size={24} />
                                <p className="text-xs font-bold uppercase  text-slate-400">Posting rights locked</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-2">Maintain a discipline score {'>'} 70 for 7 days to unlock.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Profile / Info Panel */}
                <div className="w-80 border-l border-[var(--app-border)] bg-[var(--app-bg)]/30 p-8 space-y-8 hidden xl:block">
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-6">Your Status</h3>
                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-xl text-center">
                            <div className="w-16 h-16 bg-indigo-50 ring-4 ring-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 font-bold text-xl">
                                {disciplineScore}
                            </div>
                            <p className="text-xs font-bold uppercase mb-1">Discipline Score</p>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase ">Elite Operator</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-6">Moderation Rules</h3>
                        <div className="space-y-4">
                            <RuleItem text="No tips / buy-sell calls" />
                            <RuleItem text="No P&L shaming" />
                            <RuleItem text="Read-only by default (7 days)" />
                            <RuleItem text="Posting rights unlocks via score" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function ChannelItem({ active, icon, label, onClick, mentorOnly = false }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                active
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-indigo-400 hover:bg-white/50"
            )}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="capitalize">{label}</span>
            </div>
            {mentorOnly && <ShieldCheck size={12} className={active ? "text-indigo-200" : "text-slate-400"} />}
        </button>
    );
}

function Message({ user, time, text, isMentor = false, isSystem = false }: any) {
    if (isSystem) {
        return (
            <div className="flex items-center gap-4 py-2 opacity-60 italic">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Info size={12} /> {text}
                </div>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>
        );
    }

    return (
        <div className="flex gap-4 group">
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm shrink-0",
                isMentor ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
            )}>
                {user[0]}
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-bold uppercase", isMentor ? "text-indigo-600" : "text-slate-900")}>{user}</span>
                    <span className="text-[8px] font-bold text-slate-400">{time}</span>
                    {isMentor && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[7px] font-bold uppercase  rounded-full">Pro Mentor</span>}
                </div>
                <div className={cn(
                    "p-4 rounded-2xl rounded-tl-none text-sm font-medium leading-relaxed max-w-xl",
                    isMentor ? "bg-indigo-50/50 text-indigo-900" : "bg-slate-50 text-slate-700"
                )}>
                    {text}
                </div>
            </div>
        </div>
    );
}

function RuleItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 size={12} className="text-indigo-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{text}</span>
        </div>
    );
}
