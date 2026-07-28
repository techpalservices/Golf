import {api} from "@/api/apiConfig.ts";
import type {ApiResponse} from "@/features/auth/types.ts";
import type {CreateManager, ManagerListProps} from "@/features/manager/types.ts";
import type {User} from "@/features/user/types.ts";

export const userApi = {
    getAllUsers: () =>
        api.get<ApiResponse<User[]>>('/users/all'),

    getAllManagers: () =>
        api.get<ApiResponse<ManagerListProps>>('/users/managers'),

    addManager: (data: CreateManager) =>
        api.post('/users/add-manager', data),
}