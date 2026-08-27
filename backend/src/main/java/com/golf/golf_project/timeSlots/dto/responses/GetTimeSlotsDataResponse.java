package com.golf.golf_project.timeSlots.dto.responses;

import com.golf.golf_project.timeSlots.enums.ETStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record GetTimeSlotsDataResponse(
        UUID id,
        LocalDateTime startTime,
        LocalDateTime endTime,
        int bookedPlayers,
        ETStatus status
) {
}
