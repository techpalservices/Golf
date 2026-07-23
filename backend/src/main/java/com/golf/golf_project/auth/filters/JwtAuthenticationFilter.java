package com.golf.golf_project.auth.filters;

import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.auth.services.MfaService;
import com.golf.golf_project.auth.utils.AuthUtils;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import com.golf.golf_project.users.wrapper.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

@AllArgsConstructor
public class JwtAuthenticationFilter
        extends UsernamePasswordAuthenticationFilter
{

    private final AuthenticationManager authenticationManager;
    private final AuthUtils authUtils;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MfaService mfaService;

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest req,
            HttpServletResponse res
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, String> credentials = mapper.readValue(
                    req.getInputStream(),
                    Map.class
            );

            String identifier = credentials.get("identifier");
            String password = credentials.get("password");

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(identifier, password);
            return authenticationManager.authenticate(authenticationToken);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse authentication request body", e);
        }
    }

    @Override
    public void successfulAuthentication(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain,
            Authentication authResult
    ) throws IOException {
        UserDetailsImpl userDetails = (UserDetailsImpl) authResult.getPrincipal();
        User user = userRepository.findUserByUsername(userDetails.getUsername());
        boolean mfaRequired = user.isTotpEnabled();

        if (mfaRequired) {
            mfaService.initiateMfa(user);

            String mfaToken = jwtTokenProvider.generateMfaToken(user.getUsername());

            boolean production = false;

            ResponseCookie mfaCookie = ResponseCookie.from("preAuthToken", mfaToken)
                    .httpOnly(true)
                    .secure(production)
                    .path("/mfa/verify")
                    .sameSite("Lax")
                    .maxAge(5 * 60) // 5 minutes, matches token expiry
                    .build();

            res.addHeader(HttpHeaders.SET_COOKIE, mfaCookie.toString());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "MFA code sent to your email");
            responseBody.put("availableMethods", List.of("Email"));

            res.setContentType("application/json");
            new ObjectMapper().writeValue(res.getOutputStream(), responseBody);
        } else {
            SignUpDTOResponse token = authUtils.generateTokenResponse(
                    userDetails,
                    res
            );

            String roleStr =
                    user.getRole() != null
                            ? user.getRole().getName()
                            : null;

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("phoneNumber", user.getPhoneNumber());
            userInfo.put("gender", user.getGender() != null ? user.getGender().name() : null);
            userInfo.put("role", roleStr);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Successfully authenticated");
            responseBody.put("data", userInfo);

            res.setContentType("application/json");
            new ObjectMapper().writeValue(res.getOutputStream(), responseBody);
        }
    }

    @Override
    protected void unsuccessfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            org.springframework.security.core.AuthenticationException failed
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", 401);
        errorDetails.put("message", "Invalid credentials");
        new ObjectMapper().writeValue(response.getOutputStream(), errorDetails);
    }
}