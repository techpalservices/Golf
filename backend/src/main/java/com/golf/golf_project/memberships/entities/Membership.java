package com.golf.golf_project.memberships.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.memberships.enums.EMStatus;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "memberships")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Membership extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "membership_id")
    private UUID id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EMStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "membership", orphanRemoval = true)
    private List<User> players;
}
