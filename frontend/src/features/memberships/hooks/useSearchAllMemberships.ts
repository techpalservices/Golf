import { useInfiniteQuery } from '@tanstack/react-query';
import { membershipApi } from '@/api/endpoints/membership.api';
import type { Membership, SearchAllMemberships } from '../types';

export function useSearchAllMemberships(filters: Omit<SearchAllMemberships, 'page' | 'size'>) {
    return useInfiniteQuery<Membership[]>({
        queryKey: ['memberships', 'searchAll', filters],
        queryFn: async ({ pageParam = 0 }) => {
            const cleanStatus = filters.status ? filters.status : null;
            const cleanPrice = filters.price && filters.price > 0 ? filters.price : null;
            const res = await membershipApi.searchAllMemberships({
                ...filters,
                status: cleanStatus as any,
                price: cleanPrice as any,
                page: pageParam as number,
                size: 10,
            });
            return res.data.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage && lastPage.length < 10 ? undefined : allPages.length,
        retry: false,
    });
}
