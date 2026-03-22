import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { TradeImport } from '@/types';

export function useImports() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['imports', user?.id],
        queryFn: () => api.imports.list(user!.id),
        enabled: !!user,
    });

    const createImport = useMutation({
        mutationFn: (payload: Omit<TradeImport, 'id' | 'created_at' | 'user_id'>) => {
            if (!user) throw new Error("User not logged in");
            return api.imports.create({ ...payload, user_id: user.id } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['imports', user?.id] });
        },
    });

    const updateImport = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<TradeImport> }) => {
            return api.imports.update(id, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['imports', user?.id] });
        },
    });

    const deleteImport = useMutation({
        mutationFn: api.imports.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['imports', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
        },
    });

    return {
        imports: query.data || [],
        isLoading: query.isLoading,
        createImport,
        updateImport,
        deleteImport
    };
}
