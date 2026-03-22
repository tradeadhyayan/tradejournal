import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { TradingEvent } from '@/types';
import type { Database } from '@/types/supabase';

type EventInsert = Database['public']['Tables']['trading_events']['Insert'];

export function useEvents() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery<TradingEvent[]>({
        queryKey: ['events', user?.id],
        queryFn: () => api.events.list(user!.id) as unknown as Promise<TradingEvent[]>,
        enabled: !!user,
    });

    const addEvent = useMutation({
        mutationFn: (event: Omit<EventInsert, 'user_id'>) => {
            if (!user) throw new Error("User not logged in");
            return api.events.create({ ...event, user_id: user.id } as EventInsert);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
        },
    });

    const deleteEvent = useMutation({
        mutationFn: api.events.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
        },
    });

    return {
        events: query.data || [],
        isLoading: query.isLoading,
        addEvent,
        deleteEvent
    };
}
