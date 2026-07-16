package com.golf.golf_project.auth.controllers;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.services.AuthService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/sign-up")
    public ApiResponse<SignUpDTOResponse> signUp(
            @RequestBody @Valid SignUpDTORequest req
    ) {
        return ApiResponse.success(authService.signUp(req));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestBody Map<String, String> body
    ) throws Exception {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }
        authService.logout(refreshToken);
        return ResponseEntity.ok("User logged out");
    }
}
