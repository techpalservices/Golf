import {useMutation} from "@tanstack/react-query";
import {authApi} from "@/api/endpoints/auth.api.ts";
import {toast} from "sonner";
import { useTranslation } from "react-i18next";
import {useAuthStore} from "@/features/auth/store.ts";
import { useNavigate } from "react-router-dom";

export function useMfaVerification() {
    const { t } = useTranslation('auth');
    const loginStore = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.mfaVerification,
        onSuccess: (response: any) => {
            if (response.data.success) {
                loginStore(response.data.data);
                toast.success(t('notification.loginSuccess'));
                navigate('/dashboard', { replace: true });
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || t('notification.mfaVerificationError');
            toast.error(message);
        }
    })
}