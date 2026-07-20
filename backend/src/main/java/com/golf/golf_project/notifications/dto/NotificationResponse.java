package com.golf.golf_project.notifications.dto;

import com.golf.golf_project.notifications.enums.ENotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String title,
        String message,
        ENotificationType type,
        UUID userId        // ← just the ID, not the whole User object
) {}