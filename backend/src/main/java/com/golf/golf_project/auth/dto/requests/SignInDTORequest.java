package com.golf.golf_project.auth.dto.requests;

public record SignInDTORequest(
        String username,
        String password
) {
}