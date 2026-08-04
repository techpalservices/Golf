package com.golf.golf_project.users.dto.requests;

import jakarta.validation.constraints.NotNull;

public record SearchUserRequest(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String gender,
        String status,
        String role,

        @NotNull(message = "Page number is required")
        int page,

        @NotNull(message = "Page size is required")
        int size
) {
}
