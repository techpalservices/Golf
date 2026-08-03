package com.golf.golf_project.clubs.repositories;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.enums.ECStatus;
import com.golf.golf_project.users.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface ClubRepository extends JpaRepository<Club, UUID> {
    boolean existsByOwner(User owner);

    @Query("SELECT c FROM Club c JOIN c.owner u " +   // ← JOIN c.owner u
            "WHERE (:name IS NULL OR LOWER(c.name) LIKE :name) " +
            "AND (:city IS NULL OR LOWER(c.city) LIKE :city) " +
            "AND (:phone IS NULL OR LOWER(c.phone) LIKE :phone) " +
            "AND (:email IS NULL OR LOWER(c.email) LIKE :email) " +
            "AND (:status IS NULL OR c.status = :status) " +
            "AND (:ownerFirstName IS NULL OR LOWER(u.firstName) LIKE :ownerFirstName) " +
            "AND (:ownerLastName IS NULL OR LOWER(u.lastName) LIKE :ownerLastName)"
    )
    Page<Club> searchClubs(
            String name,
            String city,
            String phone,
            String email,
            ECStatus status,
            String ownerFirstName,
            String ownerLastName,
            Pageable pageable
    );

    Club findByOwnerId(UUID ownerId);

    Club findByOwner(User owner);
}
