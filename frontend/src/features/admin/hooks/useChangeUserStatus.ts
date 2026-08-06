import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user.api.ts";
import {toast} from "sonner";

export const useChangeUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userApi.changeUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['searchUsers'] });
            toast.success('User status updated');
        },
        onError: (err: any) => {
            toast.error('Failed to update user status: ' + err?.response?.data?.message || err.message);
        }
    })
}