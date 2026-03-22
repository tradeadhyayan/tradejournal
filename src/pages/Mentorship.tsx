import { useState } from 'react';
import {
    Users,
    Calendar,
    MessageSquare,
    CheckCircle2,
    ChevronRight,
    Activity,
    AlertCircle,
    User,
    Clock,
    UserCheck,
    Star,
    Target,
    Zap,
    History,
    FileText,
    Brain,
    Trophy,
    Plus,
    ChevronLeft,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubHeading } from '@/components/ui/SubHeading';
import { useTrades } from '@/hooks/useTrades';
import { useAutoFlags } from '@/hooks/useAutoFlags';
import { formatCurrency } from '@/lib/stats';

// Mock data integration
const MOCK_STUDENTS = [
    { id: '1', name: 'Rahul S.', pnl: '+₹12,400', discipline: 92, risk: 'Low', status: 'Active' },
    { id: '2', name: 'Amit K.', pnl: '-₹3,200', discipline: 75, risk: 'Medium', status: 'Pending Review' },
    { id: '3', name: 'Priya M.', pnl: '-₹18,000', discipline: 45, risk: 'Critical', status: 'Overtrading' },
];

const MOCK_FEEDBACK = [
    {
        id: 'rev-1',
        date: '2026-01-25',
        type: 'EOD',
        rating: 'B',
        comment: 'Good discipline on initial entries, but you hesitated on the VWAP reversal setup. Don\'t let the previous loss affect the next valid signal.',
        tags: ['Rule Followed', 'Hesitation'],
        acknowledged: false
    },
    {
        id: 'rev-2',
        date: '2026-01-24',
        type: 'EOD',
        rating: 'A',
        comment: 'Perfect execution. You stayed patient for 2 hours and hit the high-conviction setup. This is how pros trade.',
        tags: ['Perfect Process', 'Patience'],
        acknowledged: true
    }
];

const MOCK_WEEKLY = {
    period: 'Jan 19 - Jan 25',
    mentorNote: 'This week showed significant improvement in position sizing. However, morning volatility remains a struggle. We will focus on "Waiting for 10 AM" next week.',
    topMistakes: ['Morning impulsive entry', 'Wide stop on gap up', 'Exiting too early'],
    topImprovements: ['Position sizing consistency', 'EOD journal completion', 'RR selection'],
    nextWeekRules: ['No trades before 10:00 AM', 'Max 2 trades per day', 'Mandatory 5 min reflection post-trade'],
};

export default function Mentorship() {
    const [role, setRole] = useState<'student' | 'mentor'>('student');
    const [studentTab, setStudentTab] = useState('overview');
    const [mentorTab, setMentorTab] = useState('dashboard');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 font-body pb-20">
            {/* Elite Header */}
            <header className="relative p-12 bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 blur-3xl rounded-full -z-10 transition-transform group-hover:scale-110" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-200 transition-transform group-hover:rotate-6">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 border-none">Guidance Portal</h1>
                            <SubHeading className="mt-2 text-indigo-600">
                                {role === 'student' ? 'Access your performance mentorship audits' : 'Oversee and audit your student roster'}
                            </SubHeading>
                        </div>
                    </div>

                    <div className="flex p-2 bg-slate-50 rounded-[2rem] border border-slate-200 shadow-inner">
                        <button
                            onClick={() => setRole('student')}
                            className={cn(
                                "px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase transition-all",
                                role === 'student' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-indigo-600"
                            )}
                        >
                            My Performance
                        </button>
                        <button
                            onClick={() => setRole('mentor')}
                            className={cn(
                                "px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase transition-all",
                                role === 'mentor' ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-indigo-600"
                            )}
                        >
                            MANAGEMENT
                        </button>
                    </div>
                </div>
            </header>

            {role === 'student' ? (
                <StudentView activeTab={studentTab} setActiveTab={setStudentTab} />
            ) : (
                <MentorView
                    activeTab={mentorTab}
                    setActiveTab={setMentorTab}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                />
            )}
        </div>
    );
}

function StudentView({ activeTab, setActiveTab }: any) {
    return (
        <div className="space-y-10">
            {/* Sub Nav */}
            <div className="flex gap-2 p-2 bg-white rounded-[2rem] border border-slate-200 w-fit shadow-sm overflow-x-auto no-scrollbar">
                <SubTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Activity size={18} />} label="OVERVIEW" />
                <SubTab active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={<FileText size={18} />} label="REVIEWS" />
                <SubTab active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<Brain size={18} />} label="APPROVED SETUPS" />
            </div>

            {activeTab === 'overview' && <StudentHomeDashboard />}
            {activeTab === 'journal' && <TradeReviewView />}
            {activeTab === 'strategy' && <StrategyAuditView />}
        </div>
    );
}

function MentorView({ activeTab, setActiveTab, selectedStudent, setSelectedStudent }: any) {
    if (selectedStudent) {
        return <StudentProfileView student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="space-y-10">
            {/* Mentor Navigation */}
            <div className="flex gap-2 p-2 bg-white rounded-[2rem] border border-slate-200 w-fit shadow-sm overflow-x-auto no-scrollbar">
                <SubTab active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18} />} label="DASHBOARD" />
                <SubTab active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} label="STUDENTS" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {MOCK_STUDENTS.map(s => (
                                    <StudentCard key={s.id} student={s} onClick={() => setSelectedStudent(s)} />
                                ))}
                            </div>
                            <section className="p-12 bg-white border border-slate-200 rounded-[3.5rem] shadow-sm">
                                <h3 className="text-2xl font-bold mb-10 tracking-tighter text-slate-900 border-none uppercase">Review Queue</h3>
                                <ReviewQueue />
                            </section>
                        </>
                    )}
                    {activeTab === 'students' && (
                        <div className="grid grid-cols-1 gap-6">
                            {MOCK_STUDENTS.map(s => <StudentCard key={s.id} student={s} wide onClick={() => setSelectedStudent(s)} />)}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <AlertsPanel />
                    <div className="p-10 bg-indigo-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
                            <Zap size={100} className="fill-white" />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-4">Mentor Capacity</p>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase text-white/60">Active Utilization</span>
                                <span className="text-2xl font-bold">12 / 30</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StudentHomeDashboard() {
    const { trades } = useTrades();
    const todayTrades = trades.filter(t => new Date(t.date).toDateString() === new Date().toDateString());
    const isJournalDone = todayTrades.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Performance Stats */}
            <div className="space-y-8">
                <HighlightStatCard
                    label="Today's Performance"
                    value={formatCurrency(todayTrades.reduce((acc, t) => acc + t.net_pnl, 0))}
                    sub={`Trades: ${todayTrades.length}`}
                    icon={<TrendingUp className="text-indigo-600" />}
                    variant="indigo"
                />
                <HighlightStatCard
                    label="Compliance"
                    value={isJournalDone ? "CLEAN" : "PENDING"}
                    sub={isJournalDone ? "Logs Recorded" : "Awaiting EOD Submission"}
                    icon={isJournalDone ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
                    variant={isJournalDone ? 'emerald' : 'rose'}
                />
                <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">Strategy Accuracy</h4>
                    <div className="space-y-6">
                        <ProgressBar label="ORB BREAKOUT" value={85} />
                        <ProgressBar label="VWAP REVERSAL" value={72} />
                    </div>
                </div>
            </div>

            {/* Column 2: Mentor Feedback */}
            <div className="space-y-8">
                <div className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group h-full flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600"><Star size={100} /></div>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Star size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Mentor Directive</h2>
                    </div>

                    <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 mb-8 flex-1">
                        <p className="text-xl font-medium text-slate-700 leading-relaxed italic">
                            "{MOCK_FEEDBACK[0].comment}"
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase shadow-xl hover:bg-rose-600 transition-all">I've Reviewed This</button>
                        <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase shadow-sm hover:border-indigo-600 transition-all">Full History</button>
                    </div>
                </div>
            </div>

            {/* Column 3: Objectives & Blueprints */}
            <div className="space-y-8">
                <div className="p-8 bg-indigo-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden group leading-none">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <Zap size={100} className="fill-white" />
                    </div>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-8 opacity-60">Adaptive Blueprints</p>
                    <div className="space-y-3 relative z-10">
                        {[
                            { text: "Consistency King", cat: "PSYCH" },
                            { text: "Size Scale-Up", cat: "RISK" },
                            { text: "Zero Revenge Mode", cat: "CORE" }
                        ].map((b, i) => (
                            <button key={i} className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-between transition-all group/item">
                                <div className="flex items-center gap-3">
                                    <div className="px-2 py-1 bg-indigo-500/20 rounded-lg text-[7px] font-bold text-indigo-300 border border-indigo-500/30">
                                        {b.cat}
                                    </div>
                                    <span className="text-[11px] font-bold tracking-tight uppercase">{b.text}</span>
                                </div>
                                <Plus size={14} className="text-white/20 group-hover/item:text-white transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm leading-none">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shadow-inner">
                            <Target size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Tactical Focus</h4>
                    </div>
                    <p className="text-xl font-bold text-slate-800 tracking-tighter leading-tight mb-8">
                        {MOCK_WEEKLY.nextWeekRules[0]}
                    </p>
                    <div className="space-y-3">
                        {MOCK_WEEKLY.nextWeekRules.slice(1, 3).map(rule => (
                            <div key={rule} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">{rule}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TradeReviewView() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
                {MOCK_FEEDBACK.map(review => (
                    <div key={review.id} className="bg-white border border-slate-200 p-12 rounded-[4rem] shadow-sm flex flex-col md:flex-row gap-12 items-start group hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
                        <div className="flex flex-col items-center gap-4 shrink-0">
                            <div className={cn(
                                "w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl font-bold shadow-2xl",
                                review.rating === 'A' ? "bg-emerald-500 text-white shadow-emerald-100" :
                                    review.rating === 'B' ? "bg-amber-500 text-white shadow-amber-100" : "bg-rose-500 text-white shadow-rose-100"
                            )}>
                                {review.rating}
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{review.type} GRADE</span>
                        </div>

                        <div className="flex-1 space-y-10 leading-none">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-3">
                                    {review.tags.map(tag => (
                                        <span key={tag} className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase rounded-full border border-indigo-100 shadow-sm">{tag}</span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50 px-4 py-2 rounded-full border border-slate-100">{new Date(review.date).toLocaleDateString()}</span>
                            </div>

                            <p className="text-2xl font-medium text-slate-800 leading-relaxed italic border-l-4 border-indigo-100 pl-8">
                                "{review.comment}"
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-slate-100">
                                <button className={cn(
                                    "px-10 py-5 rounded-2xl text-[10px] font-bold uppercase transition-all shadow-xl leading-none",
                                    review.acknowledged ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none cursor-default flex items-center gap-3" : "bg-slate-900 text-white hover:bg-indigo-600"
                                )}>
                                    {review.acknowledged ? <><CheckCircle2 size={18} /> Verified Review</> : 'Acknowledge Audit'}
                                </button>
                                <button className="text-[10px] font-bold uppercase text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-3">
                                    <MessageSquare size={18} /> Append Reflection Notes
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StrategyAuditView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-12 bg-white border border-slate-200 rounded-[4rem] shadow-sm space-y-12">
                <div className="flex items-center gap-6 leading-none">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                        <Brain size={40} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold uppercase tracking-tighter text-slate-900">Operator Precision</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Accuracy by setup architecture</p>
                    </div>
                </div>
                <div className="space-y-8">
                    <ProgressBar label="ORB BREAKOUT" value={85} />
                    <ProgressBar label="VWAP REVERSAL" value={72} />
                    <ProgressBar label="MEAN REVERSION" value={45} />
                </div>
            </div>

            <div className="p-12 bg-slate-900 border border-slate-800 rounded-[4rem] shadow-2xl space-y-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck size={180} /></div>
                <div className="flex items-center gap-6 leading-none relative z-10">
                    <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/20">
                        <Target size={40} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold uppercase tracking-tighter">Approved Protocol</h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase mt-2">Safety standards for live trading</p>
                    </div>
                </div>
                <div className="space-y-4 relative z-10">
                    {['2R Minimum Requirement', 'No Entry Post 2:30 PM', 'Max SL: 0.5% Capital'].map(m => (
                        <div key={m} className="flex items-center gap-6 p-6 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all cursor-default">
                            <CheckCircle2 size={28} className="text-indigo-400" />
                            <span className="text-base font-bold uppercase tracking-tight text-white/90">{m}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StudentProfileView({ student, onBack }: any) {
    const [subTab, setSubTab] = useState('overview');
    return (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <button onClick={onBack} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-all uppercase tracking-widest mb-4">
                <ChevronLeft size={18} /> Return to Academy Roster
            </button>

            <div className="flex flex-col xl:flex-row items-center justify-between p-16 bg-indigo-600 text-white rounded-[5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-16 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000 rotate-12"><Users size={300} /></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center text-6xl font-bold shadow-2xl border border-white/20">{student.name[0]}</div>
                    <div className="text-center md:text-left leading-none">
                        <h2 className="text-6xl font-bold mb-6 tracking-tighter">{student.name}</h2>
                        <div className="flex gap-4">
                            <span className="px-6 py-3 bg-white/10 rounded-2xl text-[10px] font-bold uppercase border border-white/10">ID: STUDENT-{student.id}</span>
                            <span className={cn(
                                "px-6 py-3 rounded-2xl text-[10px] font-bold uppercase shadow-xl",
                                student.risk === 'Low' ? "bg-emerald-500" : "bg-rose-500"
                            )}>Risk Architecture: {student.risk}</span>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex gap-16 text-center items-center mt-12 xl:mt-0 bg-white/10 p-10 rounded-[4rem] border border-white/10 backdrop-blur-md">
                    <div><p className="text-[10px] uppercase font-bold opacity-60 mb-4 tracking-widest">Growth Delta</p><p className="text-5xl font-bold tracking-tighter">+₹48.2K</p></div>
                    <div className="w-[1px] h-12 bg-white/20" />
                    <div><p className="text-[10px] uppercase font-bold opacity-60 mb-4 tracking-widest">Precision</p><p className="text-5xl font-bold tracking-tighter">{student.discipline}%</p></div>
                </div>
            </div>

            <div className="flex gap-12 border-b border-slate-100 px-8">
                {['overview', 'audit stream', 'protocol'].map(t => (
                    <button
                        key={t}
                        onClick={() => setSubTab(t)}
                        className={cn(
                            "pb-8 text-xs font-bold uppercase transition-all relative",
                            subTab === t ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {t}
                        {subTab === t && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                    </button>
                ))}
            </div>

            {subTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="p-16 bg-white border border-slate-200 shadow-sm rounded-[5rem] space-y-12">
                        <h3 className="text-3xl font-bold tracking-tighter uppercase text-slate-800">Growth Projection</h3>
                        <div className="h-80 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-slate-400 gap-4">
                            <Activity size={48} className="opacity-20" />
                            <p className="font-bold text-[10px] uppercase">Telemetry Data Pending...</p>
                        </div>
                    </div>
                    <div className="p-16 bg-white border border-slate-200 shadow-sm rounded-[5rem] space-y-12">
                        <h3 className="text-3xl font-bold tracking-tighter uppercase text-slate-800">Setup Efficiency</h3>
                        <div className="space-y-10">
                            <ProgressBar label="ORB BREAKOUT" value={72} />
                            <ProgressBar label="VWAP REVERSAL" value={55} />
                            <ProgressBar label="MEAN REVERSION" value={42} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Utility Components
function SubTab({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-4 px-10 py-5 rounded-[1.5rem] text-[12px] font-bold transition-all shrink-0 uppercase tracking-tight",
                active
                    ? "bg-slate-900 text-white shadow-2xl scale-105"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            )}
        >
            {icon} {label}
        </button>
    );
}

function HighlightStatCard({ label, value, sub, icon, variant }: any) {
    const variants: any = {
        indigo: "border-indigo-100 bg-indigo-50/50",
        rose: "border-rose-100 bg-rose-50/50",
        emerald: "border-emerald-100 bg-emerald-50/50",
    };

    return (
        <div className={cn("p-8 border rounded-[3rem] shadow-sm flex items-center justify-between group transition-all duration-500 hover:scale-[1.02]", variants[variant])}>
            <div className="space-y-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight opacity-60">{label}</p>
                <p className={cn(
                    "text-4xl font-bold tracking-tighter border-none",
                    variant === 'rose' ? "text-rose-600" : variant === 'emerald' ? "text-emerald-600" : "text-slate-900"
                )}>{value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase opacity-60">{sub}</p>
            </div>
            <div className="w-20 h-20 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    );
}

function StudentCard({ student, onClick, wide = false }: any) {
    return (
        <div className={cn(
            "p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:border-indigo-400 group transition-all duration-500 cursor-pointer overflow-hidden relative",
            wide ? "flex flex-col md:flex-row items-center justify-between" : "space-y-8"
        )} onClick={onClick}>
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity"><UserCheck size={80} className="text-indigo-600" /></div>
            <div className="flex items-center gap-8 relative z-10 leading-none">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner">
                    {student.name[0]}
                </div>
                <div>
                    <h4 className="font-bold text-2xl text-slate-900 uppercase tracking-tight mb-3 transition-colors group-hover:text-indigo-600">{student.name}</h4>
                    <span className="px-4 py-2 bg-slate-50 text-[9px] font-bold text-slate-500 rounded-lg border border-slate-100">{student.status}</span>
                </div>
            </div>

            <div className={cn("grid gap-10 relative z-10", wide ? "grid-cols-3 flex-1 px-16 mt-10 md:mt-0" : "grid-cols-2")}>
                <Metric label="M-P&L" value={student.pnl} color={student.pnl.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'} />
                <Metric label="Precision" value={`${student.discipline}%`} color={student.discipline > 80 ? 'text-emerald-600' : 'text-amber-500'} />
                {wide && <Metric label="Risk Level" value={student.risk} color={student.risk === 'Low' ? 'text-emerald-600' : 'text-rose-600'} />}
            </div>

            {!wide && (
                <button className="w-full py-5 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-bold uppercase text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl transition-all relative z-10">
                    Check Progress
                </button>
            )}
        </div>
    );
}

function Metric({ label, value, color }: any) {
    return (
        <div className="leading-none">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 opacity-60 tracking-widest">{label}</p>
            <p className={cn("text-xl font-bold tracking-tighter", color)}>{value}</p>
        </div>
    );
}

function AlertsPanel() {
    return (
        <div className="p-10 bg-white border border-rose-100 rounded-[3rem] shadow-sm space-y-8">
            <header className="flex items-center justify-between px-2 leading-none">
                <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Priority Audit</h4>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </header>
            <div className="space-y-4">
                <AlertItem type="Rule" text="Priya M. exceeded max trades per day (4)." />
                <AlertItem type="Limit" text="Amit K. hit stop-loss limit for the week." />
                <AlertItem type="Journal" text="3 students haven't logged today's EOD." />
            </div>
        </div>
    );
}

function AlertItem({ type, text }: any) {
    return (
        <div className="p-6 bg-rose-50/30 rounded-[2rem] border border-rose-100/50 flex flex-col gap-2 transition-all hover:bg-rose-50/50">
            <span className="text-[10px] font-bold uppercase text-rose-600 opacity-60 tracking-tight">{type} Violation</span>
            <span className="text-xs font-bold text-slate-700 leading-relaxed uppercase">{text}</span>
        </div>
    );
}

function ReviewQueue() {
    return (
        <div className="space-y-4">
            {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-indigo-400 transition-all group duration-300">
                    <div className="flex gap-8 items-center leading-none">
                        <div className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-400 font-bold text-[10px]">STUDENT-00{i}</div>
                        <p className="text-lg font-bold text-slate-800 uppercase tracking-tight">EOD Log Submission Detected</p>
                    </div>
                    <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase hover:bg-indigo-600 shadow-xl transition-all">Audit Execution</button>
                </div>
            ))}
        </div>
    );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end leading-none">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight opacity-60">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900 tracking-tighter">{value}%</span>
                    <span className="text-[9px] font-bold uppercase text-indigo-500">ACCURACY</span>
                </div>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                <div className="h-full bg-indigo-500 rounded-full shadow-lg" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
