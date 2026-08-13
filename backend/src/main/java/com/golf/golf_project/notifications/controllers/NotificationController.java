package com.golf.golf_project.notifications.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.notifications.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getForCurrentUser(page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.unreadCount()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.markRead(id)));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        notificationService.markAllRead();
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }
}