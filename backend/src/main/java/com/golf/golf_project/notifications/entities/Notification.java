package com.golf.golf_project.notifications.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "notifications")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Notification extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    UUID id;

    @Enumerated(EnumType.STRING)
    ENotificationType type;

    @Column(name = "title")
    String title;

    @Column(name = "message")
    String message;

    @Column(name = "is_read")
    boolean isRead = false;

    @OneToOne(cascade = CascadeType.ALL)
    User user;
}
