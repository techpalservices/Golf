package com.golf.golf_project.notifications.mappers;

import com.golf.golf_project.notifications.dto.responses.NotificationResponse;
import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.users.repositories.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    private UserRepository userRepository;

    public Notification toNotification(NotificationResponse response) {
        Notification notification = new Notification();
        notification.setTitle(response.title());
        notification.setMessage(response.message());
        notification.setType(response.type());
        notification.setUser(userRepository.findById(response.userId()).orElse(null));
        return notification;
    }

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getUser().getId()
        );
    }
}
