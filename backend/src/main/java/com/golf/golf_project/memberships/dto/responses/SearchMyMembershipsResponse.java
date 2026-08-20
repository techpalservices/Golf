package com.golf.golf_project.memberships.dto.responses;

import java.util.List;

public record SearchMyMembershipsResponse(
        String title,
        String description,
        Number price,
        String status,
        List<String> benefits
) {
}
