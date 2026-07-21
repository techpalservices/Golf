import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store.ts';
import { authApi } from '@/api/endpoints/auth.api';  // ← ADD THIS

export function useLogin() {
    const loginStore = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            if (response.data.success) {
                loginStore(response.data.data);
            }
        },
    });
}