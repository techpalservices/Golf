package com.golf.golf_project.timeSlots.dto.requests;

import java.time.LocalDate;
import java.util.UUID;

public record SearchManagerTimeSlotsRequest(
        LocalDate dateFrom,
        LocalDate dateTo,
        UUID courseId,
        String q,
        int page,
        int size
) {
}
