package com.golf.golf_project.reservations.dto.requests;

import com.golf.golf_project.reservations.enums.ERStatus;

import java.util.UUID;

public record UpdateReservationStatusRequest(
        UUID id,
        ERStatus status
) {
}
