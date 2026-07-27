package com.golf.golf_project.clubs.repositories;

import com.golf.golf_project.clubs.entities.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClubRepository extends JpaRepository<Club, UUID> {
}
