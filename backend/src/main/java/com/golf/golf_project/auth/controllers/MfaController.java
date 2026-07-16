package com.golf.golf_project.auth.controllers;

import com.golf.golf_project.auth.dto.requests.MfaAppReq;
import com.golf.golf_project.auth.dto.responses.MfaVerifyResponse;
import com.golf.golf_project.auth.services.AuthService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mfa")
@AllArgsConstructor
public class MfaController {

    private final AuthService authService;

    @PostMapping("/verify")
    public ApiResponse<MfaVerifyResponse> verifyMfa(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid MfaAppReq request
    ) {
        String preAuthToken = authHeader.substring(7);
        return ApiResponse.success(authService.verifyMfa(preAuthToken, request.code()));
    }
}
