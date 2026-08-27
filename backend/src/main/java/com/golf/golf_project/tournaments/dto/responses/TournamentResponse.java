package com.golf.golf_project.tournaments.dto.responses;

import com.golf.golf_project.tournaments.enums.ETStatus;

import java.time.LocalDate;
import java.util.UUID;

public record TournamentResponse(
        UUID id,
        String name,
        String description,
        LocalDate date,
        String location,
        String clubName,
        ETStatus status,
        String imageUrl,
        Integer entryFee,
        Integer maxParticipants,
        Integer currentParticipants
) {}
