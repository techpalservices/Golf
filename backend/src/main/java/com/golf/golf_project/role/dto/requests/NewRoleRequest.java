package com.golf.golf_project.role.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record NewRoleRequest(
        @NotBlank(message = "Role is required")
        String role
) {
}
