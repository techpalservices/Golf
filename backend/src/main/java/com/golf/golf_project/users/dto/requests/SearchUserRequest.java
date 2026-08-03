package com.golf.golf_project.users.dto.requests;

import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import org.springframework.data.domain.Pageable;

public record SearchUserRequest(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String gender,
        String status,
        String role,
        int page,
        int size
) {
}
