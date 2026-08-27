package com.golf.golf_project.tournaments.dto.requests;

public record SearchTournamentRequest(
        String q,
        String status,
        String location,
        Integer page,
        Integer size
) {}
