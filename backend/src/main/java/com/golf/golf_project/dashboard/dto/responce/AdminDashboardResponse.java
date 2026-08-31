package com.golf.golf_project.dashboard.dto.responce;

import java.util.List;

/**
 * Full payload for the admin dashboard, returned in a single request
 * (GET /api/dashboard/admin) so the frontend needs only one round-trip.
 */
public record AdminDashboardResponse(
        Kpis kpis,
        List<MonthlyGrowthPoint> usersGrowth,
        List<DailyCountPoint> reservationsTrend,
        List<DailyCountPoint> activityHeatmap,
        List<ClubCountPoint> topClubs
) {

    public record Kpis(
            long totalUsers,
            long totalPlayers,
            long totalManagers,
            long totalInfluencers,
            long totalClubs,
            long activeClubs,
            long reservationsLast30Days,
            double reservationsTrendPct,
            long pendingReservations,
            long pendingMembershipRequests,
            long activeTournaments,
            double revenueLast30Days,
            double revenueTrendPct,
            long newUsersThisMonth
    ) {
    }

    /** month formatted as "YYYY-MM". */
    public record MonthlyGrowthPoint(String month, long players, long managers, long influencers) {
    }

    /** date formatted as "YYYY-MM-DD". */
    public record DailyCountPoint(String date, long count) {
    }

    public record ClubCountPoint(String name, long count) {
    }
}