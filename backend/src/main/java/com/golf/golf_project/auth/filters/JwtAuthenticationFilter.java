package com.golf.golf_project.auth.filters;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse.AuthUser;
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
        Algorithm algorithm = Algorithm.HMAC256(authUtils.getMySecret());

        if (mfaRequired) {
            String mfaToken = JWT.create()
                    .withSubject(user.getUsername())
                    .withExpiresAt(
                            new Date(System.currentTimeMillis() + 5 * 60 * 1000)
                    )
                    .withClaim("roles", List.of("ROLE_PRE_AUTH"))
                    .sign(algorithm);

            String gender =
                    user.getGender() != null ? user.getGender().name() : null;

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("mfaTokens", mfaToken);

            AuthUser authUser = new AuthUser(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    gender,
                    "ROLE_PRE_AUTH"
            );

            responseBody.put("user", authUser);

            List<String> methods = new ArrayList<>();
            methods.add("Email");
            if (user.isTotpEnabled()) methods.add("Authenticator App");
            responseBody.put("availableMethods", methods);

            res.setContentType("application/json");
            new ObjectMapper().writeValue(res.getOutputStream(), responseBody);
        } else {
            SignUpDTOResponse token = authUtils.generateTokenResponse(
                    userDetails
            );

            SignUpDTOResponse.Tokens tokens = token.tokens();

            String roleStr =
                    user.getRole() != null
                            ? user.getRole().toString()
                            : null;

            SignUpDTOResponse.AuthUser authUser =
                    new SignUpDTOResponse.AuthUser(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getPhoneNumber(),
                            user.getGender() != null ? user.getGender().name() : null,
                            roleStr
                    );

            SignUpDTOResponse responseBody = new SignUpDTOResponse(
                    tokens,
                    authUser
            );

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