package com.golf.golf_project.users.dto.requests;

import com.golf.golf_project.users.enums.EUGender;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record UpdateUserDataRequest(
        @Pattern(regexp = ".*\\S.*", message = "First name must not be blank")
        String firstName,

        @Pattern(regexp = ".*\\S.*", message = "Last name must not be blank")
        String lastName,

        EUGender gender,
        String bio,
        LocalDate birthDate,
        String phoneNumber
) {
}
