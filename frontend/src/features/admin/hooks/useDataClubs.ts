import {useQuery} from "@tanstack/react-query";
import {clubApi} from "@/api/endpoints/club.api.ts";

export function useDataClubs() {

    return useQuery({
        queryKey: ['getAllClubs'],
        queryFn: async () => {
            const response = await clubApi.getAllClubs()
            return response.data;
        },
        retry: false,
    })
}