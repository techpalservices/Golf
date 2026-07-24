package com.golf.golf_project.users.dto.responce;

import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;

import java.time.LocalDate;
import java.util.UUID;

public record UserDataManagementResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    String phoneNumber,
    EUStatus status,
    EUGender gender,
    String avatarURL,
    LocalDate birthDate,
    String role
) {
}
