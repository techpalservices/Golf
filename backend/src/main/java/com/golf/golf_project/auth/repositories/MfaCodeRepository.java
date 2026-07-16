package com.golf.golf_project.auth.repositories;

import com.golf.golf_project.auth.entities.MfaCode;
import com.golf.golf_project.users.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MfaCodeRepository extends JpaRepository<MfaCode, UUID> {
    MfaCode findByCodeAndUserIdAndUsedFalse(String code, UUID userId);
}
