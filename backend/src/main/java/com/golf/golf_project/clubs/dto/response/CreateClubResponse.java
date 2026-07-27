package com.golf.golf_project.clubs.dto.response;

import com.golf.golf_project.clubs.enums.ECStatus;

import java.util.UUID;

public record CreateClubResponse(
        String name,
        String address,
        String city,
        Number ddNSNumber,
        Number ddEWNumber,
        ECStatus status,
        UUID ownerId
) {
}
