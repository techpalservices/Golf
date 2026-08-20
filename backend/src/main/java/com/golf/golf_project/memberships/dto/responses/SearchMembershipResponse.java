package com.golf.golf_project.memberships.dto.responses;

import com.golf.golf_project.clubs.dto.response.ClubDataResponse;
import com.golf.golf_project.clubs.entities.Club;

import java.util.List;

public record SearchMembershipResponse(
        String title,
        String description,
        Number price,
        String status,
        ClubDataResponse club,
        List<String> benefits
) {
}
