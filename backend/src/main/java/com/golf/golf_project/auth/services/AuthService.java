package com.golf.golf_project.auth.services;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.mappers.AuthMapper;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

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
    private final AuthMapper authMapper;
    private final JwtTokenProvider  jwtTokenProvider;

    public SignUpDTOResponse signUp(SignUpDTORequest signUpDTORequest) {

        if (userRepository.existsByUsername(signUpDTORequest.username())) {
            throw new RuntimeException("Username already taken");
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

                Map<String, String> idToken = new HashMap<>();
                idToken.put("accessToken", jwtAccessToken);
                idToken.put("refreshToken", jwt);
                res.setContentType("application/json");
                new ObjectMapper().writeValue(res.getOutputStream(), idToken);

            }catch(Exception e){
                System.out.println("Refresh token error: " + e.getMessage());
                throw new AccessDeniedException(e.getMessage());
            }
        }else{
            throw new IllegalArgumentException("Refresh token is missing from the request body");
        }
    }
}
