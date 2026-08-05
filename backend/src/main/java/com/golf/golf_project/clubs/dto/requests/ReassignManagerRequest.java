package com.golf.golf_project.clubs.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ReassignManagerRequest(
        @NotNull(message = "Club ID is required")
        UUID clubId,

        @NotNull(message = "Manager ID is required")
        UUID managerId
) {
}
