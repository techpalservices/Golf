package com.golf.golf_project.role.services;

import com.golf.golf_project.role.dto.requests.NewRoleRequest;
import com.golf.golf_project.role.dto.responses.NewRoleResponse;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.mappers.RoleMapper;
import com.golf.golf_project.role.repositories.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class RoleServices {

    private final RoleMapper roleMapper;
    private final RoleRepository roleRepository;

    public NewRoleResponse newRole(NewRoleRequest newRoleRequest) {
        Role existingRole = roleRepository.findByName(newRoleRequest.role());
        if (existingRole != null){
            throw new IllegalArgumentException("Role already exists");
        }
        Role role = roleMapper.toRole(newRoleRequest);
        roleRepository.save(role);

        return roleMapper.toNewRoleResponse(role);
    }
}
