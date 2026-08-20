import { useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '@/api/endpoints/membership.api';
import { toast } from 'sonner';
import type { AddMembership } from '../types';

export function useAddMembership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddMembership) => membershipApi.addMembership(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships'] });
            toast.success('Membership added successfully', { duration: 5000 });
        },
        onError: (err: any) => {
            toast.error('Failed to add membership: ' + (err?.response?.data?.message ?? err.message));
        },
    });
}
