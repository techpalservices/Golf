package com.golf.golf_project.clubs.dto.response;

import com.golf.golf_project.clubs.enums.ECStatus;
import jakarta.persistence.Column;

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
        Number ddNSNumber,
        Number ddEWNumber,
        ECStatus status,
        UUID ownerId
) {
}
