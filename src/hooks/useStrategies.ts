import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Strategy } from '@/types';

export function useStrategies() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['strategies', user?.id],
        queryFn: () => api.strategies.list(user!.id),
        enabled: !!user,
    });

    const addStrategy = useMutation({
        mutationFn: (newStrategy: Omit<Strategy, 'id' | 'created_at' | 'user_id'>) => {
            if (!user) throw new Error("User not logged in");
            return api.strategies.create({ ...newStrategy, user_id: user.id } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['strategies', user?.id] });
        },
    });

    const updateStrategy = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Strategy> }) => {
            return api.strategies.update(id, updates as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['strategies', user?.id] });
        },
    });

    const deleteStrategy = useMutation({
        mutationFn: (id: string) => api.strategies.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['strategies', user?.id] });
        },
    });

    return {
        strategies: query.data || [],
        isLoading: query.isLoading,
        addStrategy,
        updateStrategy,
        deleteStrategy
    };
}
