package com.golf.golf_project.tournaments.repositories;

import com.golf.golf_project.tournaments.entities.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface TournamentRepository extends JpaRepository<Tournament, UUID>, JpaSpecificationExecutor<Tournament> {
}
