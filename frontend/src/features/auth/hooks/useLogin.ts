import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store.ts';
import { authApi } from '@/api/endpoints/auth.api';
import {useNavigate} from "react-router-dom";  // ← ADD THIS

export function useLogin() {
    const loginStore = useAuthStore((state) => state.login);
    const setMfaPending = useAuthStore((state) => state.setMfaPending);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            // MFA response has availableMethods, NOT success
            if (response.data.availableMethods) {
                setMfaPending(true);
                navigate('/mfa-verification');
                return;
            }

            // Normal login response has success
            if (response.data.success) {
                loginStore(response.data.data);
                navigate('/dashboard', { replace: true });
                setMfaPending(false);
            }
        },
    });
}