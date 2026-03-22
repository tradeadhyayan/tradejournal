import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30 font-body">
            <PublicHeader />

            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto font-body">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>

                <div className="prose prose-slate max-w-none space-y-8 font-medium text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">1. Information Collection</h2>
                        <p>We collect information you provide directly to us when you create an account, such as your name, email address, and phone number. We also collect trade data when you manually enter it or sync via supported broker APIs.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">2. Use of Information</h2>
                        <p>Your information is used solely to provide and improve our services, including trade analytics, personalized reporting, and account security. We do not sell your personal data to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">3. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your data. Broker API access is read-only, and we never have the capability to place orders or move funds on your behalf.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">4. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at tradeadhyayan.info@gmail.com.</p>
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
