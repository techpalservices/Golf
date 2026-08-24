import type { SearchTimeSlots } from '@/features/reservations/types';
import { api } from '@/api/apiConfig';

export const timeSlotApi = {
    searchTimeSlots: (data: SearchTimeSlots) =>
        api.post('/time-slots/search', data),
};