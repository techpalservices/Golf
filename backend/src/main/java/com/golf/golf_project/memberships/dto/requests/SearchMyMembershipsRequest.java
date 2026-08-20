package com.golf.golf_project.memberships.dto.requests;

import com.golf.golf_project.memberships.enums.EMStatus;

public record SearchMyMembershipsRequest(
        String title,
        Number price,
        EMStatus status,
        int page,
        int size
) {
}
