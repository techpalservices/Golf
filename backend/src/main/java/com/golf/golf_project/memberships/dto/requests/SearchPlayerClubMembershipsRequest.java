package com.golf.golf_project.memberships.dto.requests;

public record SearchPlayerClubMembershipsRequest(
        String search,
        int page,
        int size
) {
}
