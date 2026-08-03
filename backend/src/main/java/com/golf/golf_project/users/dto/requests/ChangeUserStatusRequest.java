package com.golf.golf_project.users.dto.requests;

import com.golf.golf_project.users.enums.EUStatus;

import java.util.UUID;

public record ChangeUserStatusRequest(
        UUID userId,
        EUStatus status
) {
}
