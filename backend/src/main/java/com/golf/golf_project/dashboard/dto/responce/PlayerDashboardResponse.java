package com.golf.golf_project.dashboard.dto.responce;

import java.util.List;
import java.util.UUID;

/**
 * Full payload for the player dashboard, returned in a single request
 * (GET /api/dashboard/player).
 *
 * {@code nextReservation} is {@code null} when the player has no upcoming
 * reservation — the frontend then hides the "next reservation" section.
 */
public record PlayerDashboardResponse(
        Kpis kpis,
        NextReservation nextReservation,
        List<RecentReservation> recentReservations,
        List<PlayerClub> myClubs
) {

    /** nextTeeTime is "HH:mm" of the next reservation, or null when there is none. */
    public record Kpis(
            String nextTeeTime,
            long totalReservations,
            long clubsCount,
            long upcomingCount
    ) {
    }

    /** The closest upcoming reservation (PENDING or ACCEPTED). date "yyyy-MM-dd", time "HH:mm". */
    public record NextReservation(
            UUID reservationId,
            String clubName,
            String clubLogoURL,
            String courseName,
            String courseImage,
            int holeCount,
            String date,
            String time,
            int players,
            String status
    ) {
    }

    /** Last past reservations, most recent first. date "yyyy-MM-dd", time "HH:mm". */
    public record RecentReservation(
            UUID id,
            String clubName,
            String date,
            String time,
            String status
    ) {
    }

    /** Clubs where the player holds an ACTIVE membership. */
    public record PlayerClub(
            UUID clubId,
            String clubName,
            String clubCity,
            String clubLogoURL,
            String membershipTitle
    ) {
    }
}