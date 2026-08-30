package com.golf.golf_project.auth.providers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.entities.RefreshToken;
import com.golf.golf_project.auth.repositories.RefreshTokenRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for JwtTokenProvider using REAL token signing (HMAC256) —
 * only the repositories are mocked. Covers generation, claims and rejection
 * of forged/expired tokens.
 */
@ExtendWith(MockitoExtension.class)
class JwtTokenProviderTest {

    private static final String SECRET = "unit-test-secret-key-0123456789abcdef";

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void initAlgorithm() {
        // No Spring context here: inject @Value field manually, then run @PostConstruct
        ReflectionTestUtils.setField(jwtTokenProvider, "mySecret", SECRET);
        jwtTokenProvider.init();
    }

    private User user(String username) {
        User u = new User();
        u.setId(new java.util.UUID(0, 0));
        u.setUsername(username);
        return u;
    }

    // ── access tokens ────────────────────────────────────────

    @Test
    @DisplayName("generateAccessToken: subject, role claim, issuer and expiry are correct")
    void generateAccessToken_containsSubjectRoleAndIssuer() {
        when(userRepository.findUserByUsername("player1")).thenReturn(user("player1"));

        String token = jwtTokenProvider.generateAccessToken("player1", "ROLE_PLAYER", "TeeTime");
        DecodedJWT decoded = jwtTokenProvider.decode(token);

        assertThat(decoded.getSubject()).isEqualTo("player1");
        assertThat(decoded.getClaim("roles").asList(String.class))
                .containsExactly("ROLE_PLAYER");
        assertThat(decoded.getIssuer()).isEqualTo("TeeTime");
        // access token must expire in ~10 minutes
        assertThat(decoded.getExpiresAt())
                .isAfter(new Date(System.currentTimeMillis() + 9 * 60 * 1000));
    }

    @Test
    @DisplayName("generateAccessToken: no issuer when issuer is null")
    void generateAccessToken_withoutIssuer_hasNoIssuer() {
        when(userRepository.findUserByUsername("player1")).thenReturn(user("player1"));

        String token = jwtTokenProvider.generateAccessToken("player1", "ROLE_PLAYER", null);

        assertThat(jwtTokenProvider.decode(token).getIssuer()).isNull();
    }

    // ── refresh tokens ───────────────────────────────────────

    @Test
    @DisplayName("generateRefreshToken: persists a token bound to the user and returns a valid JWT")
    void generateRefreshToken_persistsAndReturnsValidJwt() {
        User u = user("player1");

        String token = jwtTokenProvider.generateRefreshToken(u);
        DecodedJWT decoded = jwtTokenProvider.decode(token);

        assertThat(decoded.getSubject()).isEqualTo("player1");
        // refresh token lives ~7 days
        assertThat(decoded.getExpiresAt())
                .isAfter(new Date(System.currentTimeMillis() + 6L * 24 * 60 * 60 * 1000));

        ArgumentCaptor<RefreshToken> saved = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(saved.capture());
        assertThat(saved.getValue().getToken()).isEqualTo(token);
        assertThat(saved.getValue().getUser()).isEqualTo(u);
        assertThat(saved.getValue().isRevoked()).isFalse();
    }

    @Test
    @DisplayName("generateRefreshToken: two calls never produce identical tokens")
    void generateRefreshToken_twoCallsProduceDifferentTokens() {
        User u = user("player1");

        String token1 = jwtTokenProvider.generateRefreshToken(u);
        String token2 = jwtTokenProvider.generateRefreshToken(u);

        // guards the unique constraint on refresh_tokens.token (same-second logins)
        assertThat(token1).isNotEqualTo(token2);
    }

    // ── MFA tokens ───────────────────────────────────────────

    @Test
    @DisplayName("generateMfaToken: carries ROLE_PRE_AUTH and the purpose claim")
    void generateMfaToken_hasPreAuthRoleAndPurpose() {
        String token = jwtTokenProvider.generateMfaToken("player1");
        DecodedJWT decoded = jwtTokenProvider.decode(token);

        assertThat(decoded.getSubject()).isEqualTo("player1");
        assertThat(decoded.getClaim("roles").asList(String.class))
                .containsExactly("ROLE_PRE_AUTH");
        assertThat(decoded.getClaim("purpose").asString()).isEqualTo("LOGIN");
    }

    // ── decode: rejects forged and expired tokens ────────────

    @Test
    @DisplayName("decode: token signed with a different secret is rejected")
    void decode_forgedToken_throws() {
        String forged = JWT.create()
                .withSubject("hacker")
                .sign(Algorithm.HMAC256("wrong-secret"));

        assertThatThrownBy(() -> jwtTokenProvider.decode(forged))
                .isInstanceOf(JWTVerificationException.class);
    }

    @Test
    @DisplayName("decode: expired token is rejected")
    void decode_expiredToken_throws() {
        String expired = JWT.create()
                .withSubject("player1")
                .withExpiresAt(new Date(System.currentTimeMillis() - 1000))
                .sign(Algorithm.HMAC256(SECRET));

        assertThatThrownBy(() -> jwtTokenProvider.decode(expired))
                .isInstanceOf(JWTVerificationException.class);
    }
}
