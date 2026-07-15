package com.golf.golf_project.auth.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.auth.dto.responses.SignUpDTOResponse;
import com.golf.golf_project.auth.entities.RefreshToken;
import com.golf.golf_project.auth.mappers.AuthMapper;
import com.golf.golf_project.auth.repositories.RefreshTokenRepository;
import com.golf.golf_project.auth.utils.AuthUtils;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthMapper authMapper;
    private final AuthUtils authUtils;

    public SignUpDTOResponse signUp(SignUpDTORequest signUpDTORequest) {

        if (userRepository.existsByUsername(signUpDTORequest.username())) {
            throw new RuntimeException("Username already taken");
        }

        User user = authMapper.toUser(signUpDTORequest);
        Role role = roleRepository.findByName("ROLE_PLAYER");
        user.setRole(role);
        User savedUser = userRepository.save(user);

        Date ATexpirationDate = new Date(System.currentTimeMillis()+10*60*1000);
        Date RTexpirationDate = new Date(System.currentTimeMillis()+7L*24*60*60*1000);

        Algorithm algorithm = Algorithm.HMAC256(authUtils.getMySecret());
        String jwtAccessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(ATexpirationDate)
                .withClaim("roles", List.of("ROLE_PLAYER"))
                .sign(algorithm);

        String jwtRefreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(RTexpirationDate)
                .sign(algorithm);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(jwtRefreshToken);
        refreshToken.setUser(savedUser);
        refreshToken.setExpiresAt(RTexpirationDate);
        refreshTokenRepository.save(refreshToken);

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
            try{
                Algorithm algorithm = Algorithm.HMAC256(authUtils.getMySecret());
                JWTVerifier jwtVerifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = jwtVerifier.verify(jwt);
                String username = decodedJWT.getSubject();
                User user = userRepository.findUserByUsername(username);
                // create access token
                String jwtAccessToken = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + 10*60*1000)) // access token got 10 minutes before it expires
                        .withIssuer(req.getRequestURL().toString())
                        .withClaim("roles", List.of(user.getRole().getName()))
                        .sign(algorithm);

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
