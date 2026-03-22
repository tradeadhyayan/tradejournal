import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-emerald-600',
        error: 'bg-rose-600',
        info: 'bg-indigo-600'
    };

    const icons = {
        success: <CheckCircle size={18} />,
        error: <AlertCircle size={18} />,
        info: <Info size={18} />
    };

    return (
        <div className={cn(
            "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl text-white shadow-2xl transition-all duration-300 pointer-events-none",
            bgColors[type],
            isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
        )}>
            {icons[type]}
            <p className="text-xs font-bold uppercase ">{message}</p>
        </div>
    );
}

// Simple hook for components to use
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: ToastType; id: number } | null>(null);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, id: Date.now() });
    };

    const closeToast = () => setToast(null);

    return { toast, showToast, closeToast, ToastComponent: toast ? Toast : null };
}
