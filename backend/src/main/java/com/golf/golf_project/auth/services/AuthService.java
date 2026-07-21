package com.golf.golf_project.auth.services;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.MfaVerifyResponse;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.entities.RefreshToken;
import com.golf.golf_project.auth.mappers.AuthMapper;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.auth.repositories.RefreshTokenRepository;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.notifications.entities.Notification;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.notifications.services.NotificationService;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import javax.security.auth.Refreshable;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthMapper authMapper;
    private final JwtTokenProvider  jwtTokenProvider;
    private final MfaService mfaService;
    private final NotificationService notificationService;

    public SignUpDTOResponse signUp(SignUpDTORequest signUpDTORequest) {

        if (userRepository.existsByUsername(signUpDTORequest.username())) {
            throw new BusinessException("Username already taken");
        }

        if (userRepository.existsByEmail(signUpDTORequest.email())) {
            throw new BusinessException("Email already taken");
        }

        User user = authMapper.toUser(signUpDTORequest);
        Role role = roleRepository.findByName("ROLE_PLAYER");
        user.setRole(role);
        User savedUser = userRepository.save(user);

        String jwtAccessToken = jwtTokenProvider.generateAccessToken(
                user.getUsername(),
                user.getRole().getName(),
                null
        );

        String jwtRefreshToken = jwtTokenProvider.generateRefreshToken(
                savedUser
        );

        return authMapper.toSignUpDTOResponse(
                jwtAccessToken,
                jwtRefreshToken,
                savedUser
        );
    }

    // can be deleted or used after that
    public void logout(HttpServletResponse response) throws IOException {
        ResponseCookie deleteJwt = ResponseCookie.from("accessToken", "")
                .httpOnly(true).path("/").maxAge(0).build();

        ResponseCookie deleteRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).path("/").maxAge(0).build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteJwt.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteRefresh.toString());
    }

    public void refreshToken(HttpServletRequest req, HttpServletResponse res) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, String> requestBody = mapper.readValue(req.getInputStream(), Map.class);
        String jwt = requestBody.get("refreshToken");

        if(jwt != null && !jwt.isEmpty()){
            try{;
                DecodedJWT decodedJWT = jwtTokenProvider.decode(jwt);
                String username = decodedJWT.getSubject();
                User user = userRepository.findUserByUsername(username);
                // create access token
                String jwtAccessToken = jwtTokenProvider.generateAccessToken(
                        username,
                        user.getRole().getName(),
                        req.getRequestURL().toString()
                );

                boolean production = false;

                ResponseCookie accessCookie = ResponseCookie.from("accessToken", jwtAccessToken)
                        .httpOnly(true)
                        .secure(production)
                        .path("/")
                        .sameSite("Lax")
                        .maxAge(24 * 60 * 60)
                        .build();

                res.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("success", true);
                responseBody.put("message", "Token refreshed successfully");

                res.setContentType("application/json");
                new ObjectMapper().writeValue(res.getOutputStream(), responseBody);

            }catch(Exception e){
                System.out.println("Refresh token error: " + e.getMessage());
                throw new AccessDeniedException(e.getMessage());
            }
        }else{
            throw new IllegalArgumentException("Refresh token is missing from the request body");
        }
    }

    public void verifyMfa(String preAuthToken,
                                       String code,
                                       HttpServletResponse response
    ) {
        DecodedJWT decoded = jwtTokenProvider.decode(preAuthToken);
        String username = decoded.getSubject();

        User user = userRepository.findUserByUsername(username);
        if (user == null) throw new BusinessException("User not found");

        User verifiedUser = mfaService.verifyCode(user.getId(), code);

        String accessToken = jwtTokenProvider.generateAccessToken(
                verifiedUser.getUsername(), verifiedUser.getRole().getName(), null);
        String refreshToken = jwtTokenProvider.generateRefreshToken(verifiedUser);

        notificationService.sendNotification(
                verifiedUser,
                "Welcome to Golf Project! Your account has been successfully created."
        );

        boolean production = false; // Set this based on your environment

        ResponseCookie jwtCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(production)
                .path("/")
                .sameSite("Lax")
                .maxAge(24 * 60 * 60) // 1 day in seconds
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(production)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60) // 1 week in seconds
                .build();

        ResponseCookie deletePreAuthToken = ResponseCookie.from("preAuthToken", "")
                .httpOnly(true)
                .path("/mfa/verify")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deletePreAuthToken.toString());
    }
}
