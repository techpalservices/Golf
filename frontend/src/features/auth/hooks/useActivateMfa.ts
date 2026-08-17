import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store.ts';
import { authApi } from '@/api/endpoints/auth.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function useActivateMfa() {
    const { t } = useTranslation('auth');
    const setMfaPending = useAuthStore((state) => state.setMfaPending);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.activateMfa,
        onSuccess: () => {
            setMfaPending(true);     // ← lets the verification page through its guard
            toast.success(t('mfa.codeSent', 'Activation code sent to your email'));
            navigate('/mfa-verification');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message
                || t('notification.mfaActivationError', 'Could not start MFA activation');
            toast.error(message);
        }
    });
}