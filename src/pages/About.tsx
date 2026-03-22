import { useNavigate } from 'react-router-dom';
import { Target, Shield, Heart, CheckCircle2 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center font-body">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        The Mission for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-6xl md:text-8xl">Discipline</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                        Trade Adhyayan was built by traders, for traders. In a world of flashy signals and "quick riches," we stand for the boring, profitable reality: Discipline, Data, and Consistency.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto font-body">
                    <div className="flex flex-col md:flex-row items-center gap-16 bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <CheckCircle2 size={240} />
                        </div>
                        <div className="w-full md:w-1/3 shrink-0">
                            <div className="aspect-square bg-white/20 rounded-[3rem] border border-white/20 flex items-center justify-center text-5xl font-bold shadow-inner">AM</div>
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-indigo-200 mb-4 italic">Meet the Founder</h2>
                                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight">Mr. Ajay Mishra</h3>
                                <p className="text-lg font-bold text-indigo-100 italic">Built by a Trader Who Believes Discipline Beats Prediction</p>
                            </div>

                            <div className="space-y-6 text-indigo-50 font-medium leading-relaxed italic opacity-90">
                                <p>
                                    Trade Adhyayan was created to solve the real problem traders face: execution breakdown under pressure. After years of observing retail traders, the founder realized that most fail not from lack of knowledge, but from lack of structure and honest review.
                                </p>
                                <p>
                                    This platform is built as a mirror—showing you exactly how you trade, not how you think you trade. We help you eliminate emotional decisions and replace them with data-driven consistency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 font-body">
                    <AboutCard
                        icon={<Target className="text-indigo-600" />}
                        title="Precision Over Luck"
                        text="Every trade is data. We help you turn that data into a repeatable edge."
                    />
                    <AboutCard
                        icon={<Shield className="text-indigo-600" />}
                        title="Radical Integrity"
                        text="No fake screenshots. No signal selling. Just pure analytics and self-improvement."
                    />
                    <AboutCard
                        icon={<Heart className="text-indigo-600" />}
                        title="For the Community"
                        text="Built to empower the Indian retail trading ecosystem with professional-grade tools."
                    />
                </div>
            </section>

            <footer className="py-20 px-6 border-t border-slate-200 bg-white text-center font-body">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 size={12} className="text-indigo-600" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Made in India • For India</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase  leading-relaxed">
                    Trade Adhyayan © 2026. Empowering disciplined trading.
                </p>
            </footer>
        </div>
    );
}

function AboutCard({ icon, title, text }: any) {
    return (
        <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mb-8">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text}</p>
        </div>
    );
}
