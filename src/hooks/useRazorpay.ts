import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export function useRazorpay() {
    const { user } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = RAZORPAY_SCRIPT;
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const openCheckout = (amount: number, description: string) => {
        if (!isLoaded || !user) {
            alert('Payment system loading... please try again in a second.');
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'Trade Adhyayan',
            description: description,
            image: "", // Optional logo
            handler: async function (response: any) {
                console.log(response);
                if (response.razorpay_payment_id) {
                    // Upgrade User
                    // @ts-ignore - Supabase type inference for user update might fail on strictly typed partials
                    const { error } = await supabase
                        .from('users')
                        // @ts-ignore
                        .update({ plan: 'PREMIUM' } as any)
                        .eq('id', user.id);

                    if (error) {
                        console.error(error);
                        alert('Payment successful but upgrade failed. Contact support.');
                    } else {
                        alert('Upgrade Successful! Refreshing...');
                        window.location.reload();
                    }
                }
            },
            prefill: {
                name: user.user_metadata?.full_name || user.email,
                email: user.email,
                contact: '',
            },
            theme: {
                color: '#4f46e5',
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return { openCheckout, isLoaded };
}
