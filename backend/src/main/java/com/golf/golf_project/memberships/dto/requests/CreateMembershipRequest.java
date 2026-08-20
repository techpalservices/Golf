package com.golf.golf_project.memberships.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateMembershipRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotNull(message = "Price is required")
        Number price,

        @NotNull(message = "Benefits are required")
        List<String> benefits
) {
}
