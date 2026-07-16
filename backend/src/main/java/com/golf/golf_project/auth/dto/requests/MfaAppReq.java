package com.golf.golf_project.auth.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MfaAppReq(
        @NotBlank(message = "Code is required")
        @Size(min = 6, max = 6, message = "Code must be 6 digits")
        String code
) {
}