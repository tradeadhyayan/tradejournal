import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Users, GraduationCap, BarChart, Rocket, Heart, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function Partner() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        institute_name: '',
        mentor_name: '',
        email: '',
        community_size: '10 - 50 Students',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await (supabase as any)
                .from('partner_inquiries')
                .insert([formData]);

            if (error) throw error;
            setSubmitted(true);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-4xl font-bold mb-4">Transmission Successful!</h1>
                <p className="text-slate-500 font-bold uppercase text-sm max-w-md mb-12">
                    Thank you for reaching out. Our support desk will review your credentials and contact you shortly.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase  text-xs shadow-xl transition-all hover:scale-105"
                >
                    Return to Terminal
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-bold  text-indigo-600 uppercase">Partner Ecosystem</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                        For Educators & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sub-Brokers</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium">
                        Join hands with Trade Adhyayan to provide professional-grade journaling and analytics to your students and clients. Track progress, mentor effectively, and add professional value to your services.
                    </p>
                </div>
            </section>

            {/* Why Partner Section */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto border-y border-slate-200 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <PartnerFeature
                            icon={<GraduationCap size={32} />}
                            title="Student Oversight"
                            description="Real-time visibility into your students' or clients' trade logs and emotional discipline."
                        />
                        <PartnerFeature
                            icon={<BarChart size={32} />}
                            title="Professional Branding"
                            description="Deploy Trade Adhyayan as your official analytics partner for your entire user base."
                        />
                        <PartnerFeature
                            icon={<Rocket size={32} />}
                            title="Priority Support"
                            description="Dedicated assistance for onboarding and managing your growing community."
                        />
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Heart size={150} />
                    </div>
                    <div className="relative z-10 text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Partner Induction Form</h2>
                        <p className="text-slate-500 font-bold uppercase  text-xs">Let's build a disciplined trading culture together.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                required
                                type="text"
                                placeholder="Institute Name"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:border-indigo-600 transition-all font-body"
                                value={formData.institute_name}
                                onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                            />
                            <input
                                required
                                type="text"
                                placeholder="Lead Mentor Name"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:border-indigo-600 transition-all font-body"
                                value={formData.mentor_name}
                                onChange={(e) => setFormData({ ...formData, mentor_name: e.target.value })}
                            />
                        </div>
                        <input
                            required
                            type="email"
                            placeholder="Professional Email"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:border-indigo-600 transition-all font-body"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <select
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-bold outline-none appearance-none cursor-pointer font-body"
                            value={formData.community_size}
                            onChange={(e) => setFormData({ ...formData, community_size: e.target.value })}
                        >
                            <option>10 - 50 Students</option>
                            <option>50 - 200 Students</option>
                            <option>200+ Students</option>
                        </select>
                        <textarea
                            required
                            rows={5}
                            placeholder="Tell us about your community and requirements..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-bold outline-none resize-none focus:border-indigo-600 transition-all font-body"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                        <button
                            disabled={loading}
                            className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-bold uppercase  text-xs shadow-xl shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Submit Partnership Request <ChevronRight size={16} /></>}
                        </button>
                    </form>
                </div>
            </section>

            <footer className="py-16 px-6 bg-slate-50 border-t border-slate-100 text-center font-body">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Trade Adhyayan Partners © 2026</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Made in India • For India</p>
                </div>
            </footer>
        </div>
    );
}

function PartnerFeature({ icon, title, description }: any) {
    return (
        <div className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl transition-all group text-center border-b-4 border-b-transparent hover:border-b-indigo-600 font-body">
            <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 text-indigo-600 group-hover:rotate-12 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">{description}</p>
        </div>
    );
}
