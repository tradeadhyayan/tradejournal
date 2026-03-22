import { cn } from '@/lib/utils';
import { cloneElement, ReactElement } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactElement;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

export function StatsCard({ title, value, icon, trend, trendUp, className }: StatsCardProps) {
    return (
        <div className={cn(
            "p-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-[3rem] shadow-2xl flex items-center justify-between group hover:-translate-y-1 transition-all duration-500",
            className
        )}>
            <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        )}>
                            {trendUp ? '+' : ''}{trend}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase ">Growth</span>
                    </div>
                )}
            </div>
            <div className="w-16 h-16 bg-[var(--app-bg)]/50 rounded-[1.5rem] flex items-center justify-center border border-[var(--app-border)] group-hover:bg-indigo-600/10 group-hover:border-indigo-600/20 transition-all duration-500">
                {cloneElement(icon, { size: 28, className: "text-indigo-400" } as any)}
            </div>
        </div>
    );
}
