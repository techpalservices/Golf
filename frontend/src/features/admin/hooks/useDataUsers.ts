import {useQuery} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user.api.ts";

export function useDataUsers() {

    return useQuery({
        queryKey: ['getAllUsers'],
        queryFn: async () => {
            const response = await userApi.getAllUsers();
            return response.data;
        },
        retry: false,
    })
}