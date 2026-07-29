package com.golf.golf_project.clubs.repositories;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.users.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClubRepository extends JpaRepository<Club, UUID> {
    boolean existsByOwner(User owner);

    Club findByOwnerId(UUID ownerId);
}
