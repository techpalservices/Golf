import { api } from "@/api/apiConfig.ts";
import type { ApiResponse } from "@/features/auth/types.ts";
import type { AdminDashboardData } from "@/features/dashboard/types.ts";

export const dashboardApi = {
    getAdminDashboard: () =>
        api.get<ApiResponse<AdminDashboardData>>('/dashboard/admin'),
};