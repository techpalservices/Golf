package com.golf.golf_project.memberships.dto.responses;

import com.golf.golf_project.memberships.enums.EMRStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record SearchMembershipRequestsResponse(
        UUID id,
        String userFullName,
        String planName,
        EMRStatus status,
        LocalDateTime createdAt
) {
}
