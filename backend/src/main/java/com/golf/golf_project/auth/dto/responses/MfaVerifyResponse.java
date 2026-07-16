package com.golf.golf_project.auth.dto.responses;

import java.util.UUID;

public record MfaVerifyResponse(
        String accessToken,
        String refreshToken,
        UUID userId,
        String username,
        String role
) {
}
