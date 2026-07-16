package com.golf.golf_project.auth.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mfa_codes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MfaCode extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "code_id")
    private UUID id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
