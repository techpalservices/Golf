package com.golf.golf_project.auth.handlers;

import com.golf.golf_project.auth.entities.OAuthAccount;
import com.golf.golf_project.auth.enums.EOAProvider;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.auth.repositories.OAuthAccountRepository;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RoleRepository roleRepository;
    private final OAuthAccountRepository oauthAccountRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attrs = oAuth2User.getAttributes();
        String email = (String) attrs.get("email");

        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            String firstName = (String) (attrs.get("given_name") != null
                    ? attrs.get("given_name")
                    : attrs.get("first_name"));
            String lastName = (String) (attrs.get("family_name") != null
                    ? attrs.get("family_name")
                    : attrs.get("last_name"));

            // Determine provider from attributes
            String providerId = (String) attrs.get("sub");  // Google uses "sub"
            String registrationId = providerId != null ? "google" : "facebook";
            EOAProvider provider = EOAProvider.valueOf(registrationId.toUpperCase());

            if (providerId == null) {
                providerId = (String) attrs.get("id"); // Facebook uses "id"
            }

            // Create user
            user = new User();
            user.setFirstName(firstName != null ? firstName : "");
            user.setLastName(lastName != null ? lastName : "");
            user.setEmail(email);
            user.setUsername(email);
            user.setStatus(EUStatus.ACTIVE);
            user.setGender(EUGender.MALE);
            Role role = roleRepository.findByName("ROLE_PLAYER");
            user.setRole(role);
            user = userRepository.save(user);

            // Create OAuth link
            OAuthAccount oauthAccount = new OAuthAccount();
            oauthAccount.setProvider(provider);
            oauthAccount.setProviderId(providerId);
            oauthAccount.setUser(user);
            oauthAccountRepository.save(oauthAccount);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getUsername(), user.getRole().getName(), null);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true).secure(false).path("/").sameSite("Lax").maxAge(86400).build();
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true).secure(false).path("/").sameSite("Lax").maxAge(604800).build();

        res.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        res.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        res.sendRedirect("http://localhost:5173/dashboard");
    }
}