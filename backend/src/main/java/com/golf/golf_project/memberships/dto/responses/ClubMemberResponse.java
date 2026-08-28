package com.golf.golf_project.memberships.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * A member of a club = a player whose membership request was ACCEPTED.
 */
public record ClubMemberResponse(
        UUID requestId,
        UUID playerId,
        String userFullName,
        String planName,
        LocalDateTime memberSince,
        String contact
) {
}