package com.golf.golf_project.users.controllers;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.users.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        userService.getUsers(),
                        "Users retrieved successfully"
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/managers")
    public ResponseEntity<?> getManagers() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        userService.getManagers(),
                        "Managers retrieved successfully"
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-manager")
    public ResponseEntity<?> addManager(
            @RequestBody @Valid SignUpDTORequest signUpDTORequest
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        userService.AddManager(signUpDTORequest),
                        "Manager added successfully"
                )
        );
    }
}
