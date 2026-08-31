import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from "@/api/endpoints/dashboard.api.ts";
import type { PlayerDashboardData } from "@/features/dashboard/types.ts";

export function usePlayerDashboard() {
    return useQuery({
        queryKey: ['player-dashboard'],
        queryFn: async () => {
            const res = await dashboardApi.getPlayerDashboard();
            return res.data.data;
        },
        staleTime: 60_000, // avoid refetch storms when navigating back to the dashboard
        retry: false,
    });
}