import { Brain, PlayCircle, BookCheck, Sparkles, ChevronRight, Search, Zap, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useCashfree } from '@/hooks/useCashfree';

const curricula = [
    {
        id: 'structure',
        title: 'Market Structure 101',
        duration: '2h 15m',
        lessons: 12,
        category: 'Advanced',
        level: 'Advanced',
        color: 'bg-indigo-600',
        price: 2999,
        description: 'Master the mechanical identification of order blocks and liquidity sweeps.'
    },
    {
        id: 'psychology',
        title: 'Emotion Regulation',
        duration: '1h 45m',
        lessons: 8,
        category: 'Psychology',
        level: 'Intermediate',
        color: 'bg-purple-600',
        price: 1999,
        description: 'Deconstruct neurological biases and develop a systematic framework for risk neutrality.'
    },
    {
        id: 'volatility',
        title: 'Volatility Expansion',
        duration: '3h 10m',
        lessons: 15,
        category: 'Strategic',
        level: 'Elite',
        color: 'bg-rose-600',
        price: 3999,
        description: 'Trading the VCP (Volatility Contraction Pattern) for explosive asymmetric breakouts.'
    }
];

export default function Learn() {
    const [activeTab, setActiveTab] = useState('ALL');
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
    const { openMockCheckout, loading } = useCashfree();

    const handleEnroll = async (course: any) => {
        if (enrolledCourses.includes(course.id)) {
            // Navigate to course content
            return;
        }

        await openMockCheckout(course.title, course.price, () => {
            setEnrolledCourses(prev => [...prev, course.id]);
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* ... (rest of header same) ... */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                        <Brain className="w-9 h-9 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Knowledge Hub</h1>
                        <p className="text-slate-500 text-sm font-bold tracking-wide">Professional training for serious traders</p>
                    </div>
                </div>
                <div className="flex bg-indigo-50/50 p-1 rounded-2xl border border-slate-200 shrink-0 shadow-sm">
                    {['ALL', 'ADVANCED', 'PSYCHOLOGY', 'ELITE'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold  uppercase transition-all",
                                activeTab === tab ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                            )}
                        >{tab}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {curricula.map((course) => (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden group hover:border-indigo-500/40 hover:translate-y-[-4px] transition-all flex flex-col h-full shadow-2xl">
                        <div className={cn("h-48 relative flex items-center justify-center overflow-hidden", course.color + "/10")}>
                            <div className={cn("absolute inset-0 opacity-10", course.color)} />
                            <PlayCircle className="w-16 h-16 text-white opacity-40 group-hover:opacity-100 transition-all z-10 group-hover:scale-110" />
                            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                <span className="text-[9px] font-bold uppercase  text-white">{course.level}</span>
                            </div>
                            {!enrolledCourses.includes(course.id) && (
                                <div className="absolute top-6 right-6 bg-indigo-600 px-3 py-1.5 rounded-full border border-indigo-400 shadow-xl">
                                    <span className="text-[10px] font-bold text-white">₹{course.price}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-indigo-50/50 rounded text-[8px] font-bold text-slate-400 border border-slate-200">{course.category}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-900">{course.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{course.description}</p>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-200 mb-8">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-indigo-500" />
                                    <span className="text-xs font-bold text-slate-900">{course.lessons} Units</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-purple-500" />
                                    <span className="text-xs font-bold text-slate-900">{course.duration}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleEnroll(course)}
                                disabled={loading}
                                className={cn(
                                    "w-full py-4 rounded-2xl text-[11px] font-bold transition-all shadow-lg",
                                    enrolledCourses.includes(course.id) 
                                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20"
                                )}
                            >
                                {enrolledCourses.includes(course.id) ? 'Enter Curriculum' : `Enroll Now (₹${course.price})`}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-10 bg-gradient-to-br from-purple-600/10 to-[var(--app-card)] border border-purple-500/20 rounded-[3rem] relative overflow-hidden group shadow-xl">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/5 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-purple-500 mb-6 font-bold uppercase  text-xs">
                            <Sparkles size={16} /> Beta Access
                        </div>
                        <h2 className="text-3xl font-bold mb-4 leading-tight text-slate-900">Neural Trading Matrix</h2>
                        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md">Our next-gen training simulator uses AI to analyze your decision-making in historical high-volatility sessions.</p>
                        <button className="px-10 py-4 bg-purple-600 text-white rounded-2xl text-xs font-bold uppercase  shadow-lg hover:scale-105 transition-all hover:bg-purple-700">Request Early Access</button>
                    </div>
                </div>

                <div className="p-10 bg-white border border-slate-200 rounded-[3rem] flex flex-col justify-center shadow-xl">
                    <h4 className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mb-8">Trending Topics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Order Flow', 'Gamma Exposure', 'VCP Mastery', 'Bias Neutrality', 'Market Profile', 'Market Liquidity'].map(topic => (
                            <div key={topic} className="p-5 bg-indigo-50/50 border border-slate-200 rounded-2xl hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all cursor-pointer group flex items-center justify-between shadow-sm">
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900">{topic}</span>
                                <ChevronRight size={14} className="text-[var(--app-border)] group-hover:text-purple-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
