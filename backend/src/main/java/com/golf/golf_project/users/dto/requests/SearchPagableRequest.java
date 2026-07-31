package com.golf.golf_project.users.dto.requests;

public record SearchPagableRequest(
        int size,
        int page
) {
}
