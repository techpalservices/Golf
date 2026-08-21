package com.golf.golf_project.memberships.repositories;

import com.golf.golf_project.memberships.entities.MembershipRequest;
import com.golf.golf_project.memberships.enums.EMRStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, UUID> {

    @Query("SELECT r FROM MembershipRequest r LEFT JOIN r.membership.club c " +
            "WHERE (:firstName IS NULL OR LOWER(r.player.firstName) LIKE :firstName) " +
            "AND (:lastName IS NULL OR LOWER(r.player.lastName) LIKE :lastName) " +
            "AND (:planName IS NULL OR LOWER(r.membership.title) LIKE :planName) " +
            "AND (:status IS NULL OR r.status = :status) " +
            "AND (:clubId IS NULL OR c.id = :clubId) "
    )
    Page<MembershipRequest> searchMembershipsRequests(
            String firstName,
            String lastName,
            String planName,
            EMRStatus status,
            UUID clubId,
            Pageable pageable
    );
}
