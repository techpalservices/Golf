package com.golf.golf_project.clubs.dto.requests;

import java.util.UUID;

public record CreateClubRequest(
        String name,
        String address,
        String city,
        UUID ownerId
) {
}
