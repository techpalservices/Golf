import {useInfiniteQuery} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user.api.ts";

export function useDataUsers() {

    return useInfiniteQuery({
        queryKey: ['getAllUsers'],
        queryFn: async ({pageParam = 0}) => {
            const res = await userApi.getAllUsers({ page: pageParam, size: 10 });
            return res.data.data;   // unwrap Axios → API wrapper → array
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < 10 ? undefined : allPages.length,
        retry: false,
    });
}