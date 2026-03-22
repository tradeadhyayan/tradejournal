import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function Contact() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SUCCESS');
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            <section className="pt-40 pb-20 px-6 font-body">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 mb-8">
                                <MessageSquare className="w-4 h-4 text-indigo-600" />
                                <span className="text-[10px] font-bold  text-indigo-600 uppercase">Support Terminal</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                                How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-5xl md:text-7xl">help?</span>
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed mb-12 font-medium">
                                Have a question about our platforms, subscription plans, or partnerships? Reach out to our operational desk.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start group">
                                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-lg">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">General Inquiries</p>
                                        <p className="text-lg font-bold text-slate-900 mt-1">tradeadhyayan.info@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 md:p-12 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                                        <input required type="text" className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-indigo-600 transition-all font-body" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase  ml-1">Work Email</label>
                                        <input required type="email" className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-indigo-600 transition-all font-body" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase  ml-1">Message</label>
                                    <textarea required rows={5} className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-indigo-600 transition-all resize-none font-body"></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!!status}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:bg-emerald-500 shadow-xl shadow-indigo-100"
                                >
                                    {status === 'SUCCESS' ? <>Message Sent</> : <>Transmit <Send size={14} /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-20 px-6 border-t border-slate-200 bg-white text-center font-body">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Made in India • For India</p>
                </div>
            </footer>
        </div>
    );
}
