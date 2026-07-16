package com.golf.golf_project.auth.services;

import com.golf.golf_project.auth.entities.MfaCode;
import com.golf.golf_project.auth.repositories.MfaCodeRepository;
import com.golf.golf_project.email.services.EmailService;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MfaService {

    private final MfaCodeRepository mfaCodeRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    private static final SecureRandom random = new SecureRandom();

    public void initiateMfa(User user) {
        String code = generateCode();

        MfaCode mfaCode = new MfaCode();
        mfaCode.setCode(code);
        mfaCode.setUser(user);
        mfaCode.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        mfaCodeRepository.save(mfaCode);

        emailService.sendMfaCode(user.getEmail(), code);
    }

    public User verifyCode(UUID userId, String code) {
        MfaCode mfaCode = mfaCodeRepository.findByCodeAndUserIdAndUsedFalse(code, userId);

        if (mfaCode == null) {
            throw new BusinessException("Invalid MFA code");
        }
        if (mfaCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("MFA code expired");
        }

        mfaCode.setUsed(true);
        mfaCodeRepository.save(mfaCode);

        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));
    }

    private String generateCode() {
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
