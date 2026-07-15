package com.golf.golf_project.auth.dto.requests;

import com.golf.golf_project.users.enums.EUGender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SignUpDTORequest(
        @NotBlank(message = "First name is required")
        @Size(min = 3, message = "First name should contain at least 2 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(min = 3, message = "Last name should contain at least 2 characters")
        String lastName,

        @NotNull(message = "Gender is required")
        EUGender gender,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Phone is required")
        @Size(min = 3, message = "Last name should contain at least 3 characters")
        String phoneNumber,

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        String password
) {
}