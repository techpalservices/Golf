import { useInfiniteQuery } from '@tanstack/react-query';
import { timeSlotApi } from '@/api/endpoints/timeSlot.api';
import type { ClubAvailability, SearchTimeSlots } from '../types';

interface ClubsPage {
    clubs: ClubAvailability[];
    hasMore: boolean;
}

export function useSearchTimeSlots(filters: Omit<SearchTimeSlots, 'page' | 'size'>) {
    return useInfiniteQuery<ClubsPage>({
        queryKey: ['timeSlots', 'search', filters],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await timeSlotApi.searchTimeSlots({
                ...filters,
                page: pageParam as number,
                size: 5,
            });
            const page = res.data.data;
            return { clubs: page.content, hasMore: !page.last };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasMore ? allPages.length : undefined,
        retry: false,
    });
}
