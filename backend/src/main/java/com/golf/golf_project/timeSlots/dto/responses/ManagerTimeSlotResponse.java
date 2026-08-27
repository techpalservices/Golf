package com.golf.golf_project.timeSlots.dto.responses;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * One slot of the manager's daily planning. Only "relevant" slots are returned:
 * closed/reserved ones, or slots holding accepted reservations.
 * Display status is derived client-side (or server-side raw status given).
 */
public record ManagerTimeSlotResponse(
        UUID id,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String status,
        int bookedPlayers,
        UUID courseId,
        String courseName,
        Number greenFee,
        List<PlayerRow> players
) {

    public record PlayerRow(
            UUID reservationId,
            String playerName,
            String phone,
            int players
    ) {
    }
}
