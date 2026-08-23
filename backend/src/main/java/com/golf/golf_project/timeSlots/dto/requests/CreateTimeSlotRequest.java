package com.golf.golf_project.timeSlots.dto.requests;

import com.golf.golf_project.timeSlots.enums.ETStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateTimeSlotRequest(
        LocalDateTime startTime,
        LocalDateTime endTime,
        ETStatus status,
        UUID courseId
) {
}
