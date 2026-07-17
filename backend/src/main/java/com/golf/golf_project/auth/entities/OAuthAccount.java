package com.golf.golf_project.auth.entities;

import com.golf.golf_project.auth.enums.EOAProvider;
import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "oauth_accounts",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_oauth_provider_provider_id",
                        columnNames = {"provider", "providerId"}
                )
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OAuthAccount extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "acc_id")
    private UUID id;

    @Column(nullable = false)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EOAProvider provider;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
