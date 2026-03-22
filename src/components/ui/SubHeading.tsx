import { cn } from '@/lib/utils';

interface SubHeadingProps {
    children: React.ReactNode;
    className?: string;
}

export function SubHeading({ children, className }: SubHeadingProps) {
    return (
        <p className={cn(
            "text-[10px] font-bold text-indigo-400 mb-3 leading-none uppercase tracking-[0.2em] opacity-80",
            className
        )}>
            {children}
        </p>
    );
}
