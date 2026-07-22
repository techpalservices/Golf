package com.golf.golf_project.auth.services;

import com.golf.golf_project.auth.entities.OAuthAccount;
import com.golf.golf_project.auth.enums.EOAProvider;
import com.golf.golf_project.auth.repositories.OAuthAccountRepository;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final OAuthAccountRepository oauthAccountRepository;
    private final RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        // 1. Fetch user info from provider (Google/Facebook)
        OAuth2User delegate = new org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService().loadUser(request);
        Map<String, Object> attrs = delegate.getAttributes();

        // Provider ID: Google uses "sub", Facebook uses "id"
        String providerId = attrs.get("sub") != null
                ? attrs.get("sub").toString()
                : attrs.get("id").toString();

        // Email: Facebook requires the email scope; might be null
        String email = attrs.get("email") != null
                ? attrs.get("email").toString()
                : null;

        // Name: both providers have this
        String name = attrs.get("name") != null
                ? attrs.get("name").toString()
                : "";

        // First/last name: Google uses "given_name"/"family_name", Facebook uses "first_name"/"last_name"
        String firstName = attrs.get("given_name") != null
                ? attrs.get("given_name").toString()
                : (attrs.get("first_name") != null ? attrs.get("first_name").toString() : name);

        String lastName = attrs.get("family_name") != null
                ? attrs.get("family_name").toString()
                : (attrs.get("last_name") != null ? attrs.get("last_name").toString() : "");

        EOAProvider provider = EOAProvider.valueOf(request.getClientRegistration().getRegistrationId().toUpperCase());

        System.out.println(attrs);

        // 2. Find existing OAuth link or create user
        OAuthAccount oauthAccount = oauthAccountRepository.findByProviderAndProviderId(provider, providerId);
        User user;

        if (oauthAccount != null) {
            user = oauthAccount.getUser();
        } else {
            // Check if email exists (link to existing account or create new)
            user = userRepository.findUserByEmail(email);
            if (user == null) {
                if (email == null) {
                    throw new RuntimeException("Email is required but was not provided by " + provider);
                }

                user = new User();
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email);
                user.setUsername(email); // use email as username for OAuth users
                user.setStatus(EUStatus.ACTIVE);
                user.setGender(EUGender.MALE); // provider doesn't give this reliably; user updates later
                Role role = roleRepository.findByName("ROLE_PLAYER");
                user.setRole(role);
                user = userRepository.save(user);
            }

            oauthAccount = new OAuthAccount();
            oauthAccount.setProvider(provider);
            oauthAccount.setProviderId(providerId);
            oauthAccount.setUser(user);
            oauthAccountRepository.save(oauthAccount);
        }

        // 3. Return OAuth2User with the user's ID as an attribute (for the success handler)
        String attributeKey = provider == EOAProvider.GOOGLE ? "sub" : "id";

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())),
                attrs,
                attributeKey
        );
    }
}