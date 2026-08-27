package com.golf.golf_project.tournaments.dto.requests;

import com.golf.golf_project.tournaments.enums.ETStatus;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateTournamentRequest(
        UUID id,
        String name,
        String description,
        LocalDate date,
        String location,
        Integer entryFee,
        Integer maxParticipants,
        String imageUrl,
        ETStatus status,
        UUID clubId
) {}
