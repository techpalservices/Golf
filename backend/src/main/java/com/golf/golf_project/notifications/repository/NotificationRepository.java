package com.golf.golf_project.notifications.repository;

import com.golf.golf_project.notifications.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
}
