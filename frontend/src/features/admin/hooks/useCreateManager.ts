import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user.api.ts";
import {toast} from "sonner";

export const useCreateManager = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userApi.addManager,
        onSuccess: () => {
            //reset the store cache with the new data
            queryClient.invalidateQueries({ queryKey: ['getAllManagers'] });
            queryClient.invalidateQueries({ queryKey: ['getAllUsers'] });
            toast.success('Manager created');
        },
        onError: (err: any) => {
            toast.error('Failed to create manager: ' + err?.response?.data?.message || err.message);
        }
    })
}