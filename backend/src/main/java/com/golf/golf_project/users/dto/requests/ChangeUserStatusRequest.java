package com.golf.golf_project.users.dto.requests;

import com.golf.golf_project.users.enums.EUStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ChangeUserStatusRequest(
        @NotBlank(message = "User ID is required")
        @NotNull(message = "User ID cannot be null")
        UUID userId,

        @NotBlank(message = "Status is required")
        @NotNull(message = "Status cannot be null")
        EUStatus status
) {
}
