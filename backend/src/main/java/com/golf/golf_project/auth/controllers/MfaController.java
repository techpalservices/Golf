package com.golf.golf_project.auth.controllers;

import com.golf.golf_project.auth.dto.requests.MfaAppReq;
import com.golf.golf_project.auth.dto.responses.MfaVerifyResponse;
import com.golf.golf_project.auth.services.AuthService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mfa")
@AllArgsConstructor
public class MfaController {

    private final AuthService authService;

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<?>> verifyMfa(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid MfaAppReq request,
            HttpServletResponse response
    ) {
        boolean production = false; // Set this based on your environment

        String preAuthToken = authHeader.substring(7);
        MfaVerifyResponse authResponse = authService.verifyMfa(preAuthToken, request.code());

        ResponseCookie jwtCookie = ResponseCookie.from("accessToken", authResponse.accessToken())
                .httpOnly(true)
                .secure(production)
                .path("/")
                .sameSite("Lax")
                .maxAge(24 * 60 * 60) // 1 day in seconds
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.refreshToken())
                .httpOnly(true)
                .secure(production)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60) // 1 week in seconds
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(ApiResponse.success("Successfully authenticated"));
    }
}
