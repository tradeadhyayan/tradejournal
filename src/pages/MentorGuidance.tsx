import { useNavigate } from 'react-router-dom';
import { Target, Users, Zap, ShieldCheck, MessageSquare, CheckCircle2, ArrowRight, Sparkles, BookOpen, Trophy, Rocket, GraduationCap } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { SubHeading } from '@/components/ui/SubHeading';

export default function MentorGuidance() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body pb-20">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 mb-8 border border-white/10 shadow-2xl">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <SubHeading className="text-white opacity-90 !mb-0">Personalized Coaching Terminal</SubHeading>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05] uppercase">
                        Master the Market with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-6xl md:text-8xl">Professional Guidance</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium">
                        Don't trade alone. Experience the 1:30 mentor-to-student ecosystem designed for pure professional execution.
                    </p>

                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase  text-xs shadow-2xl hover:scale-105 transition-all"
                    >
                        Explore Mentor Plan <ArrowRight className="inline-block ml-2 w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto font-body">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                        <div className="lg:col-span-2 space-y-16">
                            {/* Roadmap */}
                            <div>
                                <SubHeading>Professional Roadmap</SubHeading>
                                <h2 className="text-4xl font-bold mb-10 tracking-tighter uppercase">The 4 Phases of Mastery</h2>
                                <div className="space-y-8">
                                    <RoadmapStep number="01" title="The Student" desc="Master the hard rules of risk. Zero violations for 20 consecutive trades." />
                                    <RoadmapStep number="02" title="The Researcher" desc="Identify high-probability setups with 70% precision in backtesting." />
                                    <RoadmapStep number="03" title="The Steady Trader" desc="Execute live with zero emotional bias. Focus purely on process over P/L." />
                                    <RoadmapStep number="04" title="The Expert" desc="Manage size. SCALE positions based on systematic edge, not ego." />
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <GuidancePoint
                                    icon={<ShieldCheck className="text-indigo-600" />}
                                    title="Structural Accountability"
                                    text="Weekly and EOD reviews ensure you stick to your rules and don't slide into old habits."
                                />
                                <GuidancePoint
                                    icon={<Target className="text-indigo-600" />}
                                    title="Pattern Feedback"
                                    text="Mentors identify recurring overtrading, revenge trading, and setup-drift patterns."
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Zap size={100} />
                                </div>
                                <SubHeading className="text-indigo-600">Mentor Plan Inclusions</SubHeading>
                                <h3 className="text-xl font-bold mb-8 border-b border-slate-100 pb-6 uppercase tracking-tight">Access Protocol</h3>
                                <div className="space-y-4 mb-10">
                                    <PlanFeature text="Multiple trading accounts (self + students)" />
                                    <PlanFeature text="Student performance tracking dashboard" />
                                    <PlanFeature text="Weekly Structured Review (Strategy & Discipline)" />
                                    <PlanFeature text="End-of-Day (EOD) Review notes on logged trades" />
                                    <PlanFeature text="Behavioral Feedback Heatmaps" />
                                    <PlanFeature text="Improvement checklist & Action points" />
                                </div>

                                <div className="pt-8 border-t border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                                            <span className="text-[10px] font-bold text-amber-600 uppercase ">New: Mentor+</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-400">₹9,999 / mo</span>
                                    </div>
                                    <div className="space-y-3">
                                        <PlanFeature text="1× monthly 1:1 video call" />
                                        <PlanFeature text="Priority EOD reviews" />
                                        <PlanFeature text="Custom rulebook creation" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase  text-[10px] shadow-lg hover:bg-slate-900 transition-all"
                                >
                                    Activate Guidance
                                </button>
                            </div>

                            <div className="p-10 bg-indigo-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                                    <Trophy size={120} className="fill-white" />
                                </div>
                                <SubHeading className="text-indigo-300 opacity-60">Mentor Toolkit</SubHeading>
                                <div className="space-y-4 relative z-10">
                                    <ToolLink icon={<Rocket size={16} />} text="Professional Roadmap PDF" />
                                    <ToolLink icon={<GraduationCap size={16} />} text="Mindset Masterclass" />
                                    <ToolLink icon={<BookOpen size={16} />} text="Advanced Risk Sheet" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-20 px-6 border-t border-slate-200 bg-white text-center font-body">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Trade Adhyayan • Mentorship Ecosystem</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Made in India • For India</p>
                </div>
            </footer>
        </div>
    );
}

function RoadmapStep({ number, title, desc }: { number: string; title: string; desc: string }) {
    return (
        <div className="flex gap-8 group">
            <div className="text-4xl font-bold text-slate-200 group-hover:text-indigo-600 transition-colors duration-500 leading-none">{number}</div>
            <div className="flex-1 pb-8 border-b border-slate-200 group-last:border-none">
                <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function ToolLink({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <button className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center gap-4 transition-all group/btn">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300">
                {icon}
            </div>
            <span className="text-[11px] font-bold uppercase  text-indigo-100">{text}</span>
            <ArrowRight size={14} className="ml-auto opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-2 group-hover/btn:translate-x-0" />
        </button>
    );
}

function GuidancePoint({ icon, title, text }: any) {
    return (
        <div className="flex gap-6">
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

function PlanFeature({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            <span className="text-sm font-bold text-slate-700">{text}</span>
        </div>
    );
}
