package com.golf.golf_project.notifications.repository;

import com.golf.golf_project.notifications.entities.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserUsername(String userUsername, Pageable pageable);

    List<Notification> findByUserUsernameAndIsReadFalse(String username);

    List<Notification> findByUserUsernameOrderByCreatedAtDesc(String username);

    long countByUserUsernameAndIsReadFalse(String username);

    Optional<Notification> findByIdAndUserUsername(UUID id, String username);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.username = :username AND n.isRead = false")
    int markAllAsRead(@Param("username") String username);
}
