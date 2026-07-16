package com.golf.golf_project.auth.providers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.entities.RefreshToken;
import com.golf.golf_project.auth.repositories.RefreshTokenRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.secret}")
    private String mySecret;

    private Algorithm algorithm;

    @PostConstruct
    public void init(){
        this.algorithm = Algorithm.HMAC256(this.mySecret);
    }

    public String generateAccessToken(
            String username,
            String userRole,
            String issuer
    ) {
        User user = userRepository.findUserByUsername(username);
        Date accessTokenExpiry = new Date(System.currentTimeMillis() + 10*60*1000);

        JWTCreator.Builder builder = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(accessTokenExpiry)
                .withClaim("roles", List.of(userRole));

        if (issuer != null) {
            builder.withIssuer(issuer);
        }

        return builder.sign(algorithm);
    }

    public String generateRefreshToken(User user) {
        Date refreshTokenExpiry = new Date(System.currentTimeMillis() + 7L*24*60*60*1000);

        String jwtRefreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(refreshTokenExpiry)
                .sign(algorithm);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(jwtRefreshToken);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(refreshTokenExpiry);
        refreshTokenRepository.save(refreshToken);

        return jwtRefreshToken;
    }

    public String generateMfaToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + 5 * 60 * 1000))
                .withClaim("roles", List.of("ROLE_PRE_AUTH"))
                .sign(algorithm);
    }

    public DecodedJWT decode(String token) {
        JWTVerifier verifier = JWT.require(this.algorithm).build();
        return verifier.verify(token);
    }
}
