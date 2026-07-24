package com.golf.golf_project.auth.mappers;

import java.time.LocalDateTime;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.users.entities.User;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AuthMapper {

    public SignUpDTOResponse toSignUpDTOResponse(
            User user
    ) {
        return new SignUpDTOResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getGender().toString(),
                user.getRole().getName()
        );
    }
}