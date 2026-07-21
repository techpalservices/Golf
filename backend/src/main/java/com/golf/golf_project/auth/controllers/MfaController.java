package com.golf.golf_project.auth.controllers;

import com.golf.golf_project.auth.dto.requests.MfaAppReq;
import com.golf.golf_project.auth.dto.responses.MfaVerifyResponse;
import com.golf.golf_project.auth.services.AuthService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mfa")
@AllArgsConstructor
public class MfaController {

    private final AuthService authService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyMfa(
            @CookieValue(value = "preAuthToken") String preAuthToken,
            @RequestBody @Valid MfaAppReq request,
            HttpServletResponse response
    ) {

        if (preAuthToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("MFA token is missing"); // just for the test
        }

        authService.verifyMfa(preAuthToken, request.code(), response);

        return ResponseEntity.ok(ApiResponse.success("Successfully authenticated"));
    }
}
