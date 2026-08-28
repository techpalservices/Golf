package com.golf.golf_project.memberships.dto.responses;

import java.time.LocalDate;
import java.util.UUID;

public record PlayerClubMembershipResponse(
        UUID clubId,
        String clubName,
        String clubLogoURL,
        String clubCity,
        String clubAddress,
        UUID membershipId,
        String membershipTitle,
        String membershipDescription,
        LocalDate membershipStartDate,
        LocalDate membershipEndDate,
        Long coursesCount
) {
}
