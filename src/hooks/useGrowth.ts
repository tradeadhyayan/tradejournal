import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function useRoadmap() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['roadmap', user?.id],
        queryFn: () => api.roadmap.list(user!.id),
        enabled: !!user,
    });

    const toggleStep = useMutation({
        mutationFn: ({ stepId, isCompleted }: { stepId: string; isCompleted: boolean }) => {
            if (!user) throw new Error("User not logged in");
            return api.roadmap.toggleStep(user.id, stepId, isCompleted);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roadmap', user?.id] });
        },
    });

    return {
        progress: query.data || [],
        isLoading: query.isLoading,
        toggleStep
    };
}

export function useChallenges() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['challenges', user?.id],
        queryFn: () => api.challenges.list(user!.id),
        enabled: !!user,
    });

    const updateProgress = useMutation({
        mutationFn: ({ challengeId, value }: { challengeId: string; value: number }) => {
            return api.challenges.updateProgress(challengeId, value);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges', user?.id] });
        },
    });

    return {
        challenges: query.data || [],
        isLoading: query.isLoading,
        updateProgress
    };
}

