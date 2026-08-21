package com.golf.golf_project.memberships.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.memberships.enums.EMRStatus;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "memberships_requests")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class MembershipRequest extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "request_id")
    private UUID id;

    private EMRStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    private Membership membership;

    @ManyToOne(fetch = FetchType.LAZY)
    private User players;
}
