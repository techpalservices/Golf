import {useMutation} from "@tanstack/react-query";
import {authApi} from "@/api/endpoints/auth.api.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {useAuthStore} from "@/features/auth/store.ts";

export function useLogout() {
    const navigate = useNavigate();
    const { t } = useTranslation('auth')
    const logoutStore = useAuthStore((state) => state.logout);
    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            logoutStore();
            toast.success(t('notification.logoutSuccess'));
            navigate('/login', { replace: true });
        },
        onError: () => {
            logoutStore();
            navigate('/login', { replace: true });
        },
    })
}