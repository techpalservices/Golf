package com.golf.golf_project.reservations.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record ManagerReservationResponse(
        UUID id,
        String status,
        String playerName,
        String playerPhone,
        UUID courseId,
        String courseName,
        LocalDateTime startTime,
        int numberOfPlayers,
        Number greenFee,
        LocalDateTime requestedAt
) {
}
