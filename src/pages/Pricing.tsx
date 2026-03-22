import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function Pricing() {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            period: 'forever',
            description: 'For traders exploring journal mechanics',
            features: ['Manual entry', 'Basic P&L', 'Rule checklists'],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro',
            price: '₹499',
            period: 'per month',
            description: 'Professional tools for active traders',
            features: ['Automated Broker Sync', 'Advanced strategy data', 'Psychology tracking'],
            cta: 'Start Pro Trial',
            popular: true,
        },
        {
            name: 'Mentor',
            price: '₹4,999',
            period: 'per month',
            description: 'For students seeking guidance',
            subDescription: 'Connects you with human expertise and accountability.',
            popular: false,
            sections: [
                {
                    title: 'What You Get',
                    items: ['Daily Performance Check', 'Weekly Discipline Review', 'Psychology Feedback Log'],
                },
            ],
            cta: 'Upgrade to Mentor',
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center font-body">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 mb-8">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">Invest in your discipline</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
                        Transparent <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Investment</span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-tight">
                        Choose the plan that fits your trading business.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto font-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={cn(
                                    "relative p-8 rounded-[3rem] border-2 transition-all hover:-translate-y-2 flex flex-col shadow-xl",
                                    plan.popular
                                        ? 'bg-slate-900 text-white border-transparent scale-[1.02] z-10'
                                        : 'bg-white border-slate-100'
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-tight rounded-full shadow-lg whitespace-nowrap">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-[10px] font-bold uppercase tracking-tight mb-4 text-indigo-500">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.period !== 'forever' && <span className="text-slate-500 font-bold uppercase text-[9px] ">/{plan.period}</span>}
                                    </div>
                                    <p className={cn(
                                        "text-[12px] font-bold leading-none mb-4",
                                        plan.popular ? "text-indigo-400" : "text-slate-900"
                                    )}>
                                        {plan.description}
                                    </p>
                                    {plan.subDescription && (
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter opacity-80 leading-relaxed italic">
                                            {plan.subDescription}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-6 mb-10 flex-1">
                                    {plan.features?.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <CheckCircle2 size={14} className={plan.popular ? "text-indigo-400" : "text-emerald-500"} />
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-tight",
                                                plan.popular ? "text-white/90" : "text-slate-700"
                                            )}>{feature}</span>
                                        </div>
                                    ))}

                                    {plan.sections?.map((section, sIdx) => (
                                        <div key={sIdx} className="space-y-3 pt-4 border-t border-slate-100/10 first:border-t-0 first:pt-0">
                                            <h4 className={cn(
                                                "text-[9px] font-bold uppercase ",
                                                plan.popular ? "text-indigo-300" : "text-indigo-600"
                                            )}>{section.title}</h4>
                                            {section.items.map((item, iIdx) => (
                                                <div key={iIdx} className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                                        plan.popular ? "bg-indigo-400" : "bg-indigo-600"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase tracking-tight leading-tight",
                                                        plan.popular ? "text-white/80" : "text-slate-600"
                                                    )}>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate(plan.name.includes('Mentor') ? '/login' : '/login')}
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-bold uppercase text-[10px] transition-all",
                                        plan.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.3)]'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                    )}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-200 bg-slate-50 text-center font-body">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckCircle2 size={12} className="text-indigo-600" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Made in India • For India</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase ">Trade Adhyayan © 2026</p>
            </footer>
        </div>
    );
}
