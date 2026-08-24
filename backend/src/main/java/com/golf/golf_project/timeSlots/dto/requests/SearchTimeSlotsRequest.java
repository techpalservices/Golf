package com.golf.golf_project.timeSlots.dto.requests;

import java.time.LocalDate;

public record SearchTimeSlotsRequest(
        String clubName,
        String city,
        String address,
        LocalDate date,
        int page,
        int size
) {
}
