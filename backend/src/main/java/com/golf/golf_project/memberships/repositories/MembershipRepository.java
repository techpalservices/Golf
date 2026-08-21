package com.golf.golf_project.memberships.repositories;

import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.enums.EMStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {

    @Query("SELECT m FROM Membership m LEFT JOIN m.club c " +
            "WHERE (:title IS NULL OR LOWER(m.title) LIKE :title) " +
            "AND (:price IS NULL OR m.price = :price) " +
            "AND (:status IS NULL OR m.status = :status) " +
            "AND m.status = 'ACTIVE' " +
            "AND (:clubName IS NULL OR LOWER(c.name) LIKE :clubName)"
    )
    Page<Membership> searchMemberships(
            String title,
            Number price,
            EMStatus status,
            String clubName,
            Pageable pageable
    );

    @Query("SELECT m FROM Membership m LEFT JOIN m.club c LEFT JOIN c.owner u " +
            "WHERE (:title IS NULL OR LOWER(m.title) LIKE :title) " +
            "AND (:price IS NULL OR m.price = :price) " +
            "AND (:status IS NULL OR m.status = :status) " +
            "AND (:ownerUsername IS NULL OR LOWER(u.username) LIKE :ownerUsername)"
    )
    Page<Membership> searchMyMemberships(
            String title,
            Number price,
            EMStatus status,
            String ownerUsername,
            Pageable pageable
    );

    Membership findMembershipById(UUID id);
}
