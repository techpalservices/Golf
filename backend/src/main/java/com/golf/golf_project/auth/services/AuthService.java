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
import com.golf.golf_project.notifications.services.NotificationService;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.mappers.UserMapper;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthMapper authMapper;
    private final UserMapper userMapper;
    private final JwtTokenProvider  jwtTokenProvider;
    private final MfaService mfaService;
    private final NotificationService notificationService;

    public SignUpDTOResponse signUp(SignUpDTORequest signUpDTORequest, HttpServletResponse res) {

        if (userRepository.existsByUsername(signUpDTORequest.username())) {
            throw new BusinessException("Username already taken");
        }

        if (userRepository.existsByEmail(signUpDTORequest.email())) {
            throw new BusinessException("Email already taken");
        }

        User user = userMapper.toUser(signUpDTORequest);
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

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", jwtAccessToken)
                .httpOnly(true).secure(false).path("/").sameSite("Lax").maxAge(86400).build();
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", jwtRefreshToken)
                .httpOnly(true).secure(false).path("/").sameSite("Lax").maxAge(604800).build();

        res.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        res.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return authMapper.toSignUpDTOResponse(
                savedUser
        );
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshTokenValue = cookie.getValue();
                    RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenValue);
                    if (storedToken != null && !storedToken.isRevoked()) {
                        storedToken.setRevoked(true);
                        refreshTokenRepository.save(storedToken);
                    }
                    break;
                }
            }
        }
        ResponseCookie deleteJwt = ResponseCookie.from("accessToken", "")
                .httpOnly(true).path("/").maxAge(0).build();

        ResponseCookie deleteRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).path("/").maxAge(0).build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteJwt.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteRefresh.toString());
    }

    public void refreshToken(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String jwt = null;
        if (req.getCookies() != null) {
            for (Cookie cookie : req.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if(jwt != null && !jwt.isEmpty()){
            try{
                DecodedJWT decodedJWT = jwtTokenProvider.decode(jwt);
                String username = decodedJWT.getSubject();
                User user = userRepository.findUserByUsername(username);

                RefreshToken storedToken = refreshTokenRepository.findByToken(jwt);
                if (storedToken == null || storedToken.isRevoked()) {
                    throw new AccessDeniedException("Refresh token is revoked");
                }

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

            }catch(Exception e){
                throw new AccessDeniedException(e.getMessage());
            }
        }else{
            throw new IllegalArgumentException("Refresh token is missing from the request body");
        }
    }

    public MfaVerifyResponse verifyMfa(String preAuthToken,
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
                "Welcome to Golf Project! Your login has been successfully verified!."
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

        return new MfaVerifyResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole().getName(),
                user.getGender(),
                user.getId(),
                user.getEmail(),
                user.getUsername()
        );
    }
}
