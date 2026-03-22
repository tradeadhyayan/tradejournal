import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function Header() {
    const { profile } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <h2 className="text-lg font-medium text-slate-900">
                Welcome back, {profile?.full_name || 'Trader'}
            </h2>
            <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {profile?.full_name?.[0]?.toUpperCase() || 'T'}
                </div>
            </div>
        </header>
    );
}
