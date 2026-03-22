import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Mistake } from '@/types';

export function useMistakes() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery<Mistake[]>({
        queryKey: ['mistakes', user?.id],
        queryFn: () => api.mistakes.list(user!.id) as unknown as Promise<Mistake[]>,
        enabled: !!user,
    });

    const addMistake = useMutation({
        mutationFn: (mistake: { title: string, description?: string, severity?: string }) => {
            if (!user) throw new Error("User not logged in");
            return api.mistakes.create(user.id, mistake);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mistakes', user?.id] });
        },
    });

    const updateMistake = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Mistake> }) => {
            return api.mistakes.update(id, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mistakes', user?.id] });
        },
    });

    const deleteMistake = useMutation({
        mutationFn: api.mistakes.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mistakes', user?.id] });
        },
    });

    return {
        mistakes: query.data || [],
        isLoading: query.isLoading,
        addMistake,
        updateMistake,
        deleteMistake
    };
}
