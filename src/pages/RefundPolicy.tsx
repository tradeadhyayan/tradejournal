import { useNavigate } from 'react-router-dom';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function RefundPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-body">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <RotateCcw size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">Refund Policy</h1>
                </div>

                <div className="prose prose-slate max-w-none space-y-8 font-medium text-slate-600 leading-relaxed">
                    <section className="p-8 bg-rose-50 border border-rose-100 rounded-3xl">
                        <h2 className="text-xl font-bold text-rose-900 mb-4 uppercase tracking-wider">No Refunds Policy</h2>
                        <p className="text-rose-800">
                            At Trade Adhyayan, we offer a free tier and a trial period for Pro features to ensure our platform meets your needs before you commit to a paid subscription.
                            <strong> Please note that all payments made to Trade Adhyayan are final and non-refundable.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">Subscription Cancellation</h2>
                        <p>You may cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to paid features until the end of your current billing cycle.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">Exceptional Circumstances</h2>
                        <p>Refunds are not granted for non-use of the service, change of mind, or dissatisfaction after the billing cycle has started. In rare cases of duplicate billing or technical system errors, please reach out to tradeadhyayan.info@gmail.com for review.</p>
                    </section>
                </div>

                <p className="mt-20 text-[10px] font-bold text-slate-400 uppercase ">Last Updated: January 2026</p>
                <div className="mt-8 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Made in India • For India</p>
                </div>
            </div>
        </div>
    );
}
