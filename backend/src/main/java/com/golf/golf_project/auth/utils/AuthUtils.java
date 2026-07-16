package com.golf.golf_project.auth.utils;

import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse.Tokens;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse.AuthUser;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Getter
@RequiredArgsConstructor // spring is the one that inject the dependencies not lombok, works best for non final fields like my secret in our case
public class AuthUtils {

    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String mySecret;

    private final JwtTokenProvider jwtTokenProvider;

    public SignUpDTOResponse generateTokenResponse(UserDetails userDetails){

        User user = userRepository.findUserByUsername(userDetails.getUsername());

        String jwtAccessToken = jwtTokenProvider.generateAccessToken(
                user.getUsername(),
                user.getRole().getName(),
                null
        );
        String jwtRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        String gender = user.getGender() != null ? user.getGender().name() : null;

        String role = user.getRole() != null
                ? user.getRole().getName()
                : null;

        return new SignUpDTOResponse(
                new Tokens(
                        jwtAccessToken,
                        jwtRefreshToken
                ),
                new AuthUser(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        gender,
                        role
                )
        );
    }
}