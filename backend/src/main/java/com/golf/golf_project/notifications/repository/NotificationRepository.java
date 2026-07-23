package com.golf.golf_project.notifications.repository;

import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.users.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserUsernameAndIsReadFalse(String username);
}
