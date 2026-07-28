import {useQuery} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user.api.ts";

export function useDataManagers() {

    return useQuery({
        queryKey: ['getAllManagers'],
        queryFn: async () => {
            const response = await userApi.getAllManagers();
            return response.data;
        },
        retry: false,
    })
}