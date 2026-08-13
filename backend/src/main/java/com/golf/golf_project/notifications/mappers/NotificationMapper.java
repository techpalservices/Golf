package com.golf.golf_project.notifications.mappers;

import com.golf.golf_project.notifications.dto.responses.NotificationResponse;
import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.users.repositories.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getUser().getId()
        );
    }
}
