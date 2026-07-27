package com.golf.golf_project.clubs.dto.requests;

import java.util.UUID;

public record CreateClubRequests(
        String name,
        String address,
        String city,
        Number ddNSNumber,
        Number ddEWNumber,
        UUID ownerId
) {
}
