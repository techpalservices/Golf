package com.golf.golf_project.users.controllers;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.users.dto.requests.SearchPagableRequest;
import com.golf.golf_project.users.dto.requests.SearchUserRequest;
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
    @PostMapping("/all")
    public ResponseEntity<?> getAllUsers(
            @Valid @RequestBody SearchUserRequest request
            ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        userService.getUsers(request),
                        "Users retrieved successfully"
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/managers")
    public ResponseEntity<?> getManagers(
            @Valid @RequestBody SearchPagableRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        userService.getManagers(request),
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
