package com.golf.golf_project.notifications.services;

import com.golf.golf_project.notifications.dto.responses.NotificationResponse;
import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.notifications.repository.NotificationRepository;
import com.golf.golf_project.users.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public void sendNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);

        // Add these two lines!
        notification.setTitle("Welcome");
        notification.setType(ENotificationType.USER_REGISTRATION);

        notificationRepository.save(notification);

        NotificationResponse dto = new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                user.getId()
        );

        messagingTemplate.convertAndSendToUser(user.getUsername(), "/queue/notifications", dto);
    }
}
