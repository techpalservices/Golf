package com.golf.golf_project.auth.controllers;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<SignUpDTOResponse> signUp(
            @RequestBody SignUpDTORequest signUpDTORequest
    ){
        return ResponseEntity.ok(authService.signUp(signUpDTORequest));
    }
}
