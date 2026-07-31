package com.golf.golf_project.clubs.dto.requests;

import com.golf.golf_project.clubs.enums.ECStatus;

public record SearchClubRequest(
    String name,
    String city,
    String phone,
    String email,
    ECStatus status,
    String ownerFirstName,
    String ownerLastName,
    int size,
    int page
) {
}