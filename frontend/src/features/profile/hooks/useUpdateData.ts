import {useAuthStore} from "@/features/auth/store.ts";
import {useMutation} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user.api.ts";
import {authApi} from "@/api/endpoints/auth.api.ts";
import {toast} from "sonner";

export const useUpdateData = () => {
    const login = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: userApi.updateMyData,
        onSuccess: async () => {
            try {
                const res = await authApi.me();
                if (res.data.success) {
                    login(res.data.data);
                }
                toast.success('Profile data updated successfully');
            } catch (error) {
                toast.error('Failed to sync updated profile');
            }
        },
        onError: (err: any) => {
            toast.error(`Failed to change profile data: ` + (err?.response?.data?.message || err.message));
        }
    });
}