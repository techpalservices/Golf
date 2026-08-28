package com.golf.golf_project.tournaments.dto.requests;

import java.time.LocalDate;

public record SearchTournamentRequest(
        String q,
        String status,
        String location,
        LocalDate date,
        LocalDate fromDate,
        Integer page,
        Integer size
) {}
