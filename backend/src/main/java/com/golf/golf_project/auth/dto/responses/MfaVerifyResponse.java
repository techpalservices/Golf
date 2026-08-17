package com.golf.golf_project.auth.dto.responses;

import com.golf.golf_project.users.enums.EUGender;

import java.util.UUID;

public record MfaVerifyResponse(
        String firstName,
        String lastName,
        String phoneNumber,
        String role,
        EUGender gender,
        UUID id,
        String email,
        String username,
        boolean isTotpEnabled
) {
}
