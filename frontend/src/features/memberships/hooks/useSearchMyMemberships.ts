    import { useInfiniteQuery } from '@tanstack/react-query';
import { membershipApi } from '@/api/endpoints/membership.api';
import type { Membership, SearchMyMemberships } from '../types';

export function useSearchMyMemberships(filters: Omit<SearchMyMemberships, 'page' | 'size'>) {
    return useInfiniteQuery<Membership[]>({
        queryKey: ['memberships', 'searchMy', filters],
        queryFn: async ({ pageParam = 0 }) => {
            const cleanStatus = filters.status ? filters.status : null;
            const cleanPrice = filters.price && filters.price > 0 ? filters.price : null;
            const res = await membershipApi.searchMyMemberships({
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
