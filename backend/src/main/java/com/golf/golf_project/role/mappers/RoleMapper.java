package com.golf.golf_project.role.mappers;

import com.golf.golf_project.role.dto.requests.NewRoleRequest;
import com.golf.golf_project.role.dto.responses.NewRoleResponse;
import com.golf.golf_project.role.entities.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    public Role toRole(NewRoleRequest newRoleRequest) {
        Role role = new Role();
        role.setName(newRoleRequest.role());
        return role;
    }

    public NewRoleResponse toNewRoleResponse(Role role) {
        return new NewRoleResponse(
                role.getId(),
                role.getName(),
                role.getCreatedAt()
        );
    }
}
