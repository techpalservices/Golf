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

    private final PasswordEncoder passwordEncoder;

    public User toUser(SignUpDTORequest signUpDTORequest) {
        User user = new User();
        user.setFirstName(signUpDTORequest.firstName());
        user.setLastName(signUpDTORequest.lastName());
        user.setGender(signUpDTORequest.gender());
        user.setEmail(signUpDTORequest.email());
        user.setPhoneNumber(signUpDTORequest.phoneNumber());
        user.setUsername(signUpDTORequest.username());
        user.setPassword(passwordEncoder.encode(signUpDTORequest.password()));

        return user;
    }

    public SignUpDTOResponse toSignUpDTOResponse(
            String accessToken,
            String refreshToken,
            User user
    ) {
        return new SignUpDTOResponse(
                new SignUpDTOResponse.Tokens(
                        accessToken,
                        refreshToken
                ),
                new SignUpDTOResponse.AuthUser(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getGender().toString(),
                        user.getRole().getName()
                )
        );
    }
}