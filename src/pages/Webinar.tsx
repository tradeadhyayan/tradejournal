import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, Video, CheckCircle2,
    Gift, ArrowRight, Sparkles, Zap,
    Users, BookOpen, ShieldCheck, Map
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useCashfree } from '@/hooks/useCashfree';

export default function Webinar() {
    const [registered, setRegistered] = useState(false);
    const [formData, setFormData] = useState({ name: '', whatsapp: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const { openMockCheckout } = useCashfree();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            // Step 1: Payment
            await openMockCheckout('Live Webinar', 499, async () => {
                // Step 2: Register after payment success
                try {
                    await api.webinar.register({
                        name: formData.name,
                        whatsapp: formData.whatsapp,
                        webinar_date: '1 Feb, Sunday',
                        status: 'paid' // Optional: signal paid status
                    });
                    setRegistered(true);
                } catch (err) {
                    console.error('Registration failed:', err);
                    alert('Payment successful but registration failed. Please contact support.');
                }
            });
        } catch (err) {
            console.error('Payment failed:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-body selection:bg-indigo-500/30 overflow-x-hidden">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50 to-transparent blur-[120px] rounded-full -z-10" />

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs font-bold font-heading tracking-wide text-indigo-600 uppercase">Paid Live Webinar (₹499)</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold font-heading tracking-tight mb-6 leading-tight text-slate-900">
                        Want to start trading <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600">but feeling confused?</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
                        Get a clear, simple roadmap in our 90-Minute Live Webinar designed for absolute beginners.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
                        <EventInfo icon={<Calendar className="text-indigo-600" />} label="1 Feb, Sunday" />
                        <EventInfo icon={<Clock className="text-indigo-600" />} label="11 AM Sharp" />
                        <EventInfo icon={<Video className="text-indigo-600" />} label="Google Meet" />
                    </div>

                    {!registered ? (
                        <div id="register" className="p-8 md:p-12 bg-white border border-slate-100 rounded-[3rem] shadow-2xl max-w-xl mx-auto">
                            <h3 className="text-2xl font-bold font-heading mb-8">Secure Your Spot (₹499)</h3>
                            <form onSubmit={handleRegister} className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-4">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-4">WhatsApp Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                        placeholder="+91 99999 99999"
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold font-heading uppercase tracking-widest text-xs hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Pay ₹499 & Register'}
                                </button>
                                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-500" /> No Spam. Only Learning.
                                </p>
                            </form>
                        </div>
                    ) : (
                        <div className="p-12 bg-emerald-50 border border-emerald-100 rounded-[3rem] shadow-xl max-w-xl mx-auto text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-3xl font-bold font-heading mb-4 text-emerald-900">Registration Confirmed!</h3>
                            <p className="text-emerald-700 font-bold mb-8 italic">Check your WhatsApp for the meeting link & bonuses.</p>

                            <div className="space-y-4">
                                <a
                                    href="#"
                                    className="block w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold font-heading uppercase tracking-widest text-xs shadow-lg hover:bg-emerald-700 transition-all"
                                >
                                    Join WhatsApp Group
                                </a>
                                <button className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Done</button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* What You'll Learn */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">90 Minutes to Clarity.</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Curriculum for the absolute beginner</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <OutcomeCard
                            icon={<Zap className="text-amber-500" />}
                            title="Market 101"
                            text="Understand how the stock market actually works from scratch."
                        />
                        <OutcomeCard
                            icon={<BookOpen className="text-indigo-600" />}
                            title="Stock Picking"
                            text="Learn the simple logic to pick your very first stock for trading."
                        />
                        <OutcomeCard
                            icon={<Users className="text-emerald-600" />}
                            title="Risk Control"
                            text="Basic rules to protect your capital and manage risk effectively."
                        />
                        <OutcomeCard
                            icon={<Map className="text-rose-600" />}
                            title="The Roadmap"
                            text="A clear, step-by-step path from zero to your first profitable trade."
                        />
                    </div>
                </div>
            </section>

            {/* Bonuses Section */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold font-heading mb-16">Exclusive Bonuses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BonusCard gift="Portfolio Guide PDF" />
                        <BonusCard gift="Trading Checklist" />
                        <BonusCard gift="Community Access" />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-8 tracking-tighter">Seats fill up fast.</h2>
                    <button
                        onClick={() => {
                            const el = document.getElementById('register');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-16 py-6 bg-indigo-600 text-white rounded-full font-bold font-heading text-xs uppercase hover:scale-105 transition-all shadow-2xl active:scale-95"
                    >
                        Secure Your Spot Now
                    </button>
                    <p className="mt-10 text-slate-500 font-bold font-heading text-[10px] uppercase tracking-[0.4em] opacity-60">Join 100+ beginners this Sunday.</p>
                </div>
            </section>

            <footer className="py-12 px-6 text-center border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Trade Adhyayan Coaching © 2026</p>
            </footer>
        </div>
    );
}

function EventInfo({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center gap-4 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                {icon}
            </div>
            <span className="text-lg font-bold font-heading text-slate-700">{label}</span>
        </div>
    );
}

function OutcomeCard({ icon, title, text }: any) {
    return (
        <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-indigo-600/20 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h4 className="font-bold font-heading text-xl mb-3">{title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{text}</p>
        </div>
    );
}

function BonusCard({ gift }: { gift: string }) {
    return (
        <div className="relative p-10 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-[3rem] group hover:bg-white hover:border-indigo-500 hover:shadow-2xl transition-all duration-500">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white">
                <Gift size={32} />
            </div>
            <h3 className="text-lg font-bold font-heading text-indigo-900">{gift}</h3>
            <p className="mt-3 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Worth ₹999</p>
        </div>
    );
}
