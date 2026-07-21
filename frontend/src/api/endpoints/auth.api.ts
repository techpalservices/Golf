import type { ApiResponse, AuthUserDTO, LoginDTO } from '@/features/auth/types';
import { api } from "../apiConfig";

export const authApi = {
    login: (data: LoginDTO) =>
        api.post<ApiResponse<AuthUserDTO>>('/login', data),

    me: () =>
        api.get<ApiResponse<AuthUserDTO>>('/auth/me'),
};