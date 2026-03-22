import { cn } from '@/lib/utils';
import logoUrl from '@/assets/logo.png';

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                <img
                    src={logoUrl}
                    alt="Trade Adhyayan"
                    className="w-full h-full object-contain"
                />
            </div>
            {!iconOnly && (
                <span className="text-xl font-bold tracking-tight text-indigo-950 transition-colors">
                    Trade Adhyayan
                </span>
            )}
        </div>
    );
}
