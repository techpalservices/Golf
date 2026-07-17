package com.golf.golf_project.auth.handlers;

import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("User not found after OAuth authentication");
            return;
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getUsername(), user.getRole().getName(), null);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("accessToken", accessToken);
        responseBody.put("refreshToken", refreshToken);
        responseBody.put("userId", user.getId());
        responseBody.put("username", user.getUsername());
        responseBody.put("role", user.getRole().getName());

        res.setContentType("application/json");
        new ObjectMapper().writeValue(res.getOutputStream(), responseBody);
    }
}
