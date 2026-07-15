package com.golf.golf_project.role.controllers;

import com.golf.golf_project.role.dto.requests.NewRoleRequest;
import com.golf.golf_project.role.dto.responses.NewRoleResponse;
import com.golf.golf_project.role.services.RoleServices;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roles")
@AllArgsConstructor
public class RoleController {

    private final RoleServices roleServices;

    @PostMapping("/add")
    public ResponseEntity<NewRoleResponse> addRole(
            @Valid @RequestBody NewRoleRequest request
    ){
        return ResponseEntity.ok(roleServices.newRole(request));
    }
}
