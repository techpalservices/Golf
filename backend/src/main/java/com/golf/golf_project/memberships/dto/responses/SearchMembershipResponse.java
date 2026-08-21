package com.golf.golf_project.memberships.dto.responses;

import com.golf.golf_project.clubs.dto.response.ClubDataResponse;
import com.golf.golf_project.clubs.entities.Club;

import java.util.List;
import java.util.UUID;

public record SearchMembershipResponse(
        UUID id,
        String title,
        String description,
        Number price,
        String status,
        ClubDataResponse club,
        List<String> benefits
) {
}
