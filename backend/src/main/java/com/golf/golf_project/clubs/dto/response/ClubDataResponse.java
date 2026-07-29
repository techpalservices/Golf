package com.golf.golf_project.clubs.dto.response;

import com.golf.golf_project.clubs.enums.ECStatus;

import java.time.LocalDate;
import java.util.UUID;

public record ClubDataResponse(
        UUID id,
        String name,
        String address,
        String city,
        String phone,
        String email,
        String logoURL,
        String coverURL,
        Number courseCount,
        Number memberCount,
        LocalDate createdAt,
        Number ddNSNumber,
        Number ddEWNumber,
        ECStatus status,
        UUID ownerId,
        String ownerName
) {
}
