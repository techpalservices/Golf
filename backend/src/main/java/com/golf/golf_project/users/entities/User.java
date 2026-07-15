package com.golf.golf_project.users.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EUStatus status = EUStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EUGender gender;

    private String avatarURL;

    private String bio;

    private LocalDate birthDate;

    @Column(columnDefinition = "boolean default false")
    private boolean isTotpEnabled = false;

    private String totpSecret;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;
}
