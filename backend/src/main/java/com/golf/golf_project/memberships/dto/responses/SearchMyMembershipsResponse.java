package com.golf.golf_project.memberships.dto.responses;

import java.util.List;
import java.util.UUID;

public record SearchMyMembershipsResponse(
        UUID id,
        String title,
        String description,
        Number price,
        String status,
        List<String> benefits
) {
}
