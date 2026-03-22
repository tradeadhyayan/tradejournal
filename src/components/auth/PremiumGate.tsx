import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PremiumGateProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PremiumGate({ children, fallback }: PremiumGateProps) {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const isPremium = (profile?.plan as any) && (profile.plan as any) !== 'Free' && (profile.plan as any) !== 'Basic';

    if (isPremium) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-8">
            <div className="max-w-xl w-full bg-white border border-indigo-50 rounded-[3rem] p-12 text-center shadow-xl shadow-indigo-100/20 relative overflow-hidden group">
                {/* Visual Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-[80px] -z-10 rounded-full group-hover:bg-indigo-100/50 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-50/50 blur-[60px] -z-10 rounded-full" />

                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Lock className="w-10 h-10 text-indigo-500" strokeWidth={1.5} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-100/50">
                    <Sparkles className="w-3.5 h-3.5" />
                    Premium Feature
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-4 leading-tight">
                    Elevate Your <span className="text-indigo-500">Edge</span>
                </h2>

                <p className="text-slate-500 font-medium text-base mb-10 leading-relaxed max-w-sm mx-auto">
                    Professional insights and personalized mentorship are reserved for our <span className="text-slate-800 font-bold italic">Master Plan</span> members.
                </p>

                <div className="grid grid-cols-1 gap-4 mb-10 text-left max-w-xs mx-auto">
                    {[
                        'Deep Setup DNA Analytics',
                        'Academy Mentorship Stream',
                        'Cognitive Bias Auditing',
                        'Exclusive Strategy Blueprints'
                    ].map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                <Zap size={12} strokeWidth={3} />
                            </div>
                            {feature}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/pricing')}
                        className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                        Explore Master Plan
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-5 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
