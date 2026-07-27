package com.golf.golf_project.clubs.dto.requests;

import java.util.UUID;

public record UpdateClubRequest(
        UUID id,
        String name,
        String address,
        String city,
        String phone,
        String email,
        String description,
        String logoURL,
        String coverURL,
        Number ddNSNumber,
        Number ddEWNumber
) {
}
