package com.golf.golf_project.clubs.dto.requests;

import com.golf.golf_project.clubs.enums.ECStatus;
import jakarta.validation.constraints.NotNull;

public record SearchClubRequest(
    String name,
    String city,
    String phone,
    String email,
    String status,
    String ownerFirstName,
    String ownerLastName,

    @NotNull(message = "Size is required")
    int size,
    @NotNull(message = "Page is required")
    int page
) {
}