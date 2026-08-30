package com.golf.golf_project.reservations.dto.requests;

import com.golf.golf_project.reservations.enums.ERStatus;

public record SearchPlayerReservationsRequest(
        String search,
        ERStatus status,
        int page,
        int size
) {
}
