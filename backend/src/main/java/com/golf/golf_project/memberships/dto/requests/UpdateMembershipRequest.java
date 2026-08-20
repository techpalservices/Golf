package com.golf.golf_project.memberships.dto.requests;

import com.golf.golf_project.memberships.enums.EMStatus;

import java.util.List;
import java.util.UUID;

public record UpdateMembershipRequest(
        UUID id,
        String title,
        String description,
        Number price,
        EMStatus status,
        List<String> benefits
) {
}
