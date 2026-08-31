package com.golf.golf_project.dashboard.dto.responce;

import java.util.List;

/**
 * Full payload for the manager dashboard of the authenticated manager's own
 * club, returned in a single request (GET /api/dashboard/manager).
 */
public record ManagerDashboardResponse(
        Kpis kpis,
        List<DailyRatePoint> utilization,
        List<StatusCountPoint> reservationsByStatus,
        List<DailyRevenuePoint> revenue
) {

    public record Kpis(
            long todayReservations,
            long pendingRequests,
            long members,
            double todayRevenue
    ) {
    }

    /** date formatted as "YYYY-MM-DD", rate as a 0–100 percentage. */
    public record DailyRatePoint(String date, double rate) {
    }

    /** status: PENDING / ACCEPTED / REJECTED. */
    public record StatusCountPoint(String status, long count) {
    }

    /** date formatted as "YYYY-MM-DD", revenue in MAD (green fees). */
    public record DailyRevenuePoint(String date, double revenue) {
    }
}