package com.golf.golf_project.auth.repositories;

import com.golf.golf_project.auth.entities.OAuthAccount;
import com.golf.golf_project.auth.enums.EOAProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, UUID> {
    OAuthAccount findByProviderAndProviderId(EOAProvider provider, String providerId);
}
