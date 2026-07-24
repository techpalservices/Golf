package com.golf.golf_project.role.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "roles")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Role extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "role_id")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "role", orphanRemoval = true)
    private List<User> users;
}
