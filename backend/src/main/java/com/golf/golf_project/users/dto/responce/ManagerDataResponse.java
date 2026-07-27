package com.golf.golf_project.users.dto.responce;

import java.util.UUID;

public record ManagerDataResponse(
        UUID id,
        String firstName,
        String lastName
) {
}
