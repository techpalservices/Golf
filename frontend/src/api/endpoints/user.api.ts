import {api} from "@/api/apiConfig.ts";
import type {ApiResponse} from "@/features/auth/types.ts";
import type {CreateManager, ManagerListProps} from "@/features/manager/types.ts";
import type {User} from "@/features/user/types.ts";
import type {SearchUsers} from "@/api/types.ts";

export const userApi = {
    getAllUsers: ({ page = 0, size = 10 }) =>
        api.post<ApiResponse<User[]>>('/users/all', { page, size }),

    searchUsers: (searchUser: SearchUsers) =>
        api.post<ApiResponse<User[]>>('/users/all', searchUser),

    getAllManagers: ({ page = 0, size = 10 }) =>
        api.post<ApiResponse<ManagerListProps[]>>('/users/managers', { page, size }),

    addManager: (data: CreateManager) =>
        api.post('/users/add-manager', data),
}