package com.golf.golf_project.notifications.services;

import com.golf.golf_project.auth.utils.AuthUtils;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.notifications.dto.responses.NotificationResponse;
import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.notifications.mappers.NotificationMapper;
import com.golf.golf_project.notifications.repository.NotificationRepository;
import com.golf.golf_project.users.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public void send(User user, String title, String message, ENotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .build();

        notificationRepository.save(notification);

        messagingTemplate.convertAndSendToUser(
                user.getUsername(),
                "/queue/notifications",
                notificationMapper.toResponse(notification)
        );
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getForCurrentUser(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return notificationRepository
                .findByUserUsername(this.getUsername(), pageable)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long unreadCount() {
        String username = this.getUsername();
        return notificationRepository.countByUserUsernameAndIsReadFalse(username);
    }

    @Transactional
    public NotificationResponse markRead(UUID id) {
        String username = this.getUsername();
        Notification notification = notificationRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new BusinessException("Notification not found"));
        notification.setRead(true);
        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public void markAllRead() {
        notificationRepository.markAllAsRead(this.getUsername());
    }

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new BusinessException("Not authenticated");
        }

        return auth.getName();
    }
}
