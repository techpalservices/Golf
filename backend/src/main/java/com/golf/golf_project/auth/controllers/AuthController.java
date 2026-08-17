package com.golf.golf_project.auth.controllers;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.services.AuthService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/sign-up")
    public ApiResponse<SignUpDTOResponse> signUp(
            @RequestBody @Valid SignUpDTORequest req,
            HttpServletResponse res
    ) {
        return ApiResponse.success(authService.signUp(req,res));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not authenticated");
        }

        String username = auth.getName();
        User user = userRepository.findUserByUsername(username);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("birthDate", user.getBirthDate());
        userInfo.put("gender", user.getGender());
        userInfo.put("phoneNumber", user.getPhoneNumber());
        userInfo.put("bio", user.getBio());
        userInfo.put("avatarURL", user.getAvatarURL());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole().getName());
        userInfo.put("isTotpEnabled", user.isTotpEnabled());

        return ResponseEntity.ok(ApiResponse.success(userInfo));
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<String> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        authService.refreshToken(request, response);
        return ResponseEntity.ok("Token refreshed successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        authService.logout(request, response);
        return ResponseEntity.ok("User logged out");
    }
}
