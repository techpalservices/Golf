package com.golf.golf_project.role.dto.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record NewRoleResponse(
        UUID id,
        String role,
        LocalDateTime createdAt
) {
}
