import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    upgradePlan: (plan: 'FREE' | 'PRO' | 'MENTOR') => Promise<void>;
    updateStreak: (newStreak: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code === 'PGRST116') {
                const { data: userData } = await supabase.auth.getUser();
                if (userData.user) {
                    const { data: newProfile, error: createError } = await supabase
                        .from('users')
                        .insert({
                            id: userData.user.id,
                            email: userData.user.email!,
                            full_name: userData.user.user_metadata?.full_name || '',
                            phone_number: userData.user.user_metadata?.phone_number || '',
                            plan: 'FREE'
                        })
                        .select()
                        .single();

                    if (newProfile) setProfile(newProfile as any);
                }
            } else if (data) {
                setProfile(data as any);
            }
        } catch (error) {
            console.error('Profile Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
            // We can add logic here to trigger global data refresh if needed
        }
    };

    const upgradePlan = async (plan: 'FREE' | 'PRO' | 'MENTOR') => {
        if (!user) return;
        const { error } = await supabase
            .from('users')
            .update({
                plan,
                subscription_status: 'ACTIVE',
                current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', user.id);

        if (error) throw error;
        await refreshProfile();
    };

    const updateStreak = async (newStreak: number) => {
        if (!user) return;

        // Try to update users table first (new schema)
        const { error: userError } = await supabase
            .from('users')
            .update({
                daily_streak: newStreak,
                last_rules_completed_at: new Date().toISOString()
            } as any)
            .eq('id', user.id);

        if (userError) {
            console.log('Falling back to profiles table for streak update');
            // Fallback to profiles table (old schema)
            await supabase
                .from('profiles')
                .update({ daily_streak: newStreak } as any)
                .eq('id', user.id);
        }

        await refreshProfile();
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                if (!mounted) return;

                setSession(initialSession);
                const currentUser = initialSession?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    await fetchProfile(currentUser.id);
                }
            } catch (err) {
                console.error("Auth Init Failed:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        // Safety fallback: guaranteed loading stop
        const timer = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 3500);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile, upgradePlan, updateStreak }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
