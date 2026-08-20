package com.golf.golf_project.memberships.dto.requests;

import com.golf.golf_project.memberships.enums.EMStatus;

public record SearchMembershipRequest(
        String title,
        Number price,
        EMStatus status,
        String clubName,
        int page,
        int size
) {
}
