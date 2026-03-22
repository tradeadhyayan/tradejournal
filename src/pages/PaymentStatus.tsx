import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export default function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, refreshProfile } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    const orderId = searchParams.get('order_id');
    const plan = searchParams.get('plan')?.toUpperCase();

    useEffect(() => {
        async function verifyAndUpgrade() {
            if (!orderId || !user) {
                setStatus('failed');
                return;
            }

            try {
                // Call the edge function to verify payment and update profile securely
                const { data, error } = await supabase.functions.invoke('verify-payment', {
                    body: { order_id: orderId }
                });

                if (error) throw error;

                if (data?.status === 'success') {
                    await refreshProfile();
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Verification Error:', err);
                setStatus('failed');
            }
        }

        verifyAndUpgrade();
    }, [orderId, user, refreshProfile]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body">
            <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl text-center space-y-8 animate-in zoom-in duration-500">
                {status === 'loading' && (
                    <>
                        <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto animate-pulse">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Verifying Payment...</h2>
                        <p className="text-slate-400 font-medium">Please wait while we activate your premium access.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 size={40} className="animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Upgrade Successful!</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Your account is now upgraded to <span className="text-indigo-600 font-bold">{plan}</span>.
                            Welcome to the elite side of trading.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3"
                        >
                            Go to Dashboard <ArrowRight size={18} />
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Payment Failed</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            We couldn't verify your payment. If capital was deducted, please contact support with Order ID: <code className="bg-slate-100 px-2 py-1 rounded">{orderId}</code>
                        </p>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
