package com.golf.golf_project.notifications.listeners;

import com.golf.golf_project.notifications.dto.responses.NotificationResponse;
import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationDeliveryListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();

        if (destination != null && destination.contains("/queue/notifications")) {
            String username = accessor.getUser() != null ? accessor.getUser().getName() : null;            log.info("User {} subscribed to notifications", username);

            if (username != null) {
                List<Notification> pending = notificationRepository.findByUserUsernameAndIsReadFalse(username);
                for (Notification notification : pending) {
                    NotificationResponse dto = new NotificationResponse(
                            notification.getId(),
                            notification.getTitle(),
                            notification.getMessage(),
                            notification.getType(),
                            notification.getUser().getId()
                    );
                    messagingTemplate.convertAndSendToUser(username, "/queue/notifications", dto);
                    log.info("Delivered pending notification {} to user {}", notification.getId(), username);
                }
            }
        }
    }

}
