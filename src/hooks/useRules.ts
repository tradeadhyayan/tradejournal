import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface Rule {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    category?: string;
    priority?: string;
    created_at: string;
}

export function useRules() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery<Rule[]>({
        queryKey: ['rules', user?.id],
        queryFn: () => api.rules.list(user!.id),
        enabled: !!user,
    });

    const addRule = useMutation({
        mutationFn: ({ text, category, priority }: { text: string, category?: string, priority?: string }) => {
            if (!user) throw new Error("User not logged in");
            return api.rules.create({ user_id: user.id, text, category, priority });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    const toggleRule = useMutation({
        mutationFn: ({ id, completed }: { id: string, completed: boolean }) => {
            return api.rules.toggle(id, completed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    const toggleIsDaily = useMutation({
        mutationFn: ({ id, isDaily }: { id: string, isDaily: boolean }) => {
            return api.rules.updateIsDaily(id, isDaily);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    const deleteRule = useMutation({
        mutationFn: api.rules.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    return {
        rules: (query.data || []).map(r => ({ ...r, is_daily: (r as any).is_daily ?? false })),
        isLoading: query.isLoading,
        addRule,
        toggleRule,
        toggleIsDaily,
        deleteRule
    };
}
