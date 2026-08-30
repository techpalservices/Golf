package com.golf.golf_project.reservations.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record PlayerReservationResponse(
        UUID reservationId,
        String status,
        int numberOfPlayers,
        UUID clubId,
        String clubName,
        String clubLogoURL,
        UUID courseId,
        String courseName,
        UUID timeSlotId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        LocalDateTime createdAt
) {
}
