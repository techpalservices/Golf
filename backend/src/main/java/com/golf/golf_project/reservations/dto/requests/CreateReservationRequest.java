package com.golf.golf_project.reservations.dto.requests;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateReservationRequest(
        LocalDateTime startTime,
        UUID courseId,
        int numberOfPlayers
) {
}
