import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {userApi} from "@/api/endpoints/user.api.ts";

export function useChangePassword() {
    return useMutation({
        mutationFn: userApi.updateMyPassword,
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (err: any) => {
            toast.error(`Failed to change the password: ` + err?.response?.data?.message || err.message);
        }
    })
}