import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiConfig';
import { toast } from 'sonner';

export interface CreateReservationPayload {
  courseId: string;
  startTime: string;
  numberOfPlayers: number;
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationPayload) => api.post('/reservations/add', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      toast.success('Reservation requested successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? err.message);
    },
  });
}