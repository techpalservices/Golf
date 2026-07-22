import type { ApiResponse, AuthUserDTO, LoginDTO } from '@/features/auth/types';
import { api } from "../apiConfig";
import type {mfaRequest} from "@/api/types.ts";

export const authApi = {
    login: (data: LoginDTO) =>
        api.post<ApiResponse<AuthUserDTO>>('/login', data),

    me: () =>
        api.get<ApiResponse<AuthUserDTO>>('/auth/me'),

    logout: () =>
        api.post('/auth/logout'),

    mfaVerification: (code: mfaRequest) => {
        return api.post('/mfa/verify', code );
    }
};