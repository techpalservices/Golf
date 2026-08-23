package com.golf.golf_project.timeSlots.dto.requests;

import com.golf.golf_project.timeSlots.enums.ETStatus;

import java.util.UUID;

public record UpdateTimeSlotStatusRequest(
        UUID id,
        ETStatus status
) {
}
