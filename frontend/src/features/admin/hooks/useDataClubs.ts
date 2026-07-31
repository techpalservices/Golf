import {useInfiniteQuery} from "@tanstack/react-query";
import {clubApi} from "@/api/endpoints/club.api.ts";

export function useDataClubs() {
    return useInfiniteQuery({
        queryKey: ['getAllClubs'],
        queryFn: async ({pageParam = 0}) => {
            const res = await clubApi.getAllClubs({ page: pageParam, size: 10 });
            return res.data.data;   // unwrap Axios → API wrapper → array
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < 10 ? undefined : allPages.length,
        retry: false,
    });
}