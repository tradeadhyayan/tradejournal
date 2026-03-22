import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function TermsAndConditions() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-body">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">Terms & Conditions</h1>
                </div>

                <div className="prose prose-slate max-w-none space-y-8 font-medium text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">1. Acceptance of Terms</h2>
                        <p>By accessing or using Trade Adhyayan, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">2. Use of Service</h2>
                        <p>Trade Adhyayan provides trade journaling and analytics tools. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">3. No Financial Advice</h2>
                        <p>The analytics provided by Trade Adhyayan are for educational and informational purposes only. They do not constitute financial or investment advice. Trading involves significant risk.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">4. Third-Party Integrations</h2>
                        <p>If you connect your broker account, you authorize us to fetch trade history data via read-only API access. We are not responsible for broker-side errors or data discrepancies.</p>
                    </section>
                </div>

                <p className="mt-20 text-[10px] font-bold text-slate-400 uppercase">Last Updated: January 2026</p>
                <div className="mt-8 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Made in India • For India</p>
                </div>
            </div>
        </div>
    );
}
