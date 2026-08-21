import { useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipRequestApi } from '@/api/endpoints/membershipRequest.api';
import { toast } from 'sonner';

export function useRequestMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (membershipId: string) => membershipRequestApi.request(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipRequests'] });
      toast.success('Membership request sent');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? err.message);
    },
  });
}
