package com.golf.golf_project.memberships.dto.requests;

import com.golf.golf_project.memberships.enums.EMRStatus;

public record SearchMembershipRequestsRequest(
        String firstName,
        String lastName,
        String planName,
        EMRStatus status,
        int page,
        int size
) {
}
