package com.golf.golf_project.notifications.dto.responses;

import com.golf.golf_project.notifications.enums.ENotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String title,
        String message,
        ENotificationType type,
        boolean isRead,
        LocalDateTime createdAt,
        UUID userId
) {}