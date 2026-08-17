package com.golf.golf_project.users.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserPasswordRequest(
        @NotBlank(message = "Password is blank")
        String password,

        @NotBlank(message = "New password is blank")
        String newPassword
) {
}
