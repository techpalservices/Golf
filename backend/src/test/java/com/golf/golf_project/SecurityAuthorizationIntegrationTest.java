package com.golf.golf_project;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * SECURITY INTEGRATION TESTS.
 * Boots the REAL application (with an in-memory H2 database) and exercises
 * the complete security chain: JwtAuthorizationFilter -> SecurityConfig -> @PreAuthorize.
 *
 * <p>These tests document the security contract of the API:
 * <ul>
 *   <li>no token            -> rejected (401/403)</li>
 *   <li>forged/expired token -> 401 by the filter</li>
 *   <li>wrong role           -> 403 by @PreAuthorize</li>
 *   <li>correct role         -> 200</li>
 * </ul>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SecurityAuthorizationIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;

    private String adminToken;
    private String playerToken;

    private User seedUser(String username, String email, Role role) {
        // User requires: firstName, lastName, email, username, gender (status defaults to ACTIVE)
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setFirstName("Test");
        u.setLastName("User");
        u.setGender(com.golf.golf_project.users.enums.EUGender.MALE);
        u.setRole(role);
        return userRepository.save(u);
    }

    @BeforeAll
    void seedDatabaseAndTokens() {
        // ── seed roles (data.sql is disabled in the test profile) ──
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }
        Role playerRole = roleRepository.findByName("ROLE_PLAYER");
        if (playerRole == null) {
            playerRole = new Role();
            playerRole.setName("ROLE_PLAYER");
            roleRepository.save(playerRole);
        }

        // ── seed users (generateAccessToken looks them up in the DB) ──
        seedUser("secadmin", "secadmin@test.com", adminRole);
        seedUser("secplayer", "secplayer@test.com", playerRole);

        adminToken = jwtTokenProvider.generateAccessToken("secadmin", "ROLE_ADMIN", "TeeTime");
        playerToken = jwtTokenProvider.generateAccessToken("secplayer", "ROLE_PLAYER", "TeeTime");
    }

    // ── guard: POST /users/all requires ROLE_ADMIN ───────────

    @Test
    @DisplayName("POST /users/all without token -> rejected")
    void adminEndpoint_withoutToken_isRejected() throws Exception {
        mockMvc.perform(post("/users/all")
                        .contentType("application/json")
                        .content("{\"page\":0,\"size\":10}"))
                .andExpect(status().isForbidden());   // unauthenticated -> 403 by default
    }

    @Test
    @DisplayName("POST /users/all with forged token -> 401 from the filter")
    void adminEndpoint_withForgedToken_returns401() throws Exception {
        // signed with the wrong secret, claims ROLE_ADMIN — must never pass
        String forged = JWT.create()
                .withSubject("hacker")
                .withClaim("roles", List.of("ROLE_ADMIN"))
                .sign(Algorithm.HMAC256("attacker-secret"));

        mockMvc.perform(post("/users/all")
                        .cookie(new Cookie("accessToken", forged))
                        .contentType("application/json")
                        .content("{\"page\":0,\"size\":10}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /users/all with expired token -> 401")
    void adminEndpoint_withExpiredToken_returns401() throws Exception {
        String expired = JWT.create()
                .withSubject("secadmin")
                .withClaim("roles", List.of("ROLE_ADMIN"))
                .withExpiresAt(new java.util.Date(System.currentTimeMillis() - 1000))
                .sign(Algorithm.HMAC256("unit-test-secret-key-0123456789abcdef"));

        mockMvc.perform(post("/users/all")
                        .cookie(new Cookie("accessToken", expired))
                        .contentType("application/json")
                        .content("{\"page\":0,\"size\":10}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /users/all with PLAYER token -> 403 (@PreAuthorize)")
    void adminEndpoint_withPlayerToken_isForbidden() throws Exception {
        mockMvc.perform(post("/users/all")
                        .cookie(new Cookie("accessToken", playerToken))
                        .contentType("application/json")
                        .content("{\"page\":0,\"size\":10}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /users/all with ADMIN token -> 200")
    void adminEndpoint_withAdminToken_isOk() throws Exception {
        mockMvc.perform(post("/users/all")
                        .cookie(new Cookie("accessToken", adminToken))
                        .contentType("application/json")
                        .content("{\"page\":0,\"size\":10}"))
                .andExpect(status().isOk());
    }

    // ── public surface ───────────────────────────────────────

    @Test
    @DisplayName("Public endpoint (API docs) is reachable without any token")
    void publicEndpoint_isAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
    }
}
