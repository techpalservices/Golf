import { useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '@/api/endpoints/membership.api.ts';
import { toast } from 'sonner';
import type { UpdateMembership } from '../../memberships/types.ts';

export function useUpdateMembership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateMembership) => membershipApi.updateMembership(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships'] });
            toast.success('Membership updated successfully', { duration: 5000 });
        },
        onError: (err: any) => {
            toast.error('Failed to update membership: ' + (err?.response?.data?.message ?? err.message));
        },
    });
}
