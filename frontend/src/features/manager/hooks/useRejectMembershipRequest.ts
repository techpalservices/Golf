import { useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipRequestApi } from '@/api/endpoints/membershipRequest.api';
import { toast } from 'sonner';

export function useRejectMembershipRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => membershipRequestApi.reject(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipRequests'] });
      toast.success('Request rejected');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? err.message);
    },
  });
}
