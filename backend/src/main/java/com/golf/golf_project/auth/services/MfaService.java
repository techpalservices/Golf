package com.golf.golf_project.auth.services;

import com.golf.golf_project.auth.entities.MfaCode;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import com.golf.golf_project.auth.repositories.MfaCodeRepository;
import com.golf.golf_project.email.services.EmailService;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final JwtTokenProvider jwtTokenProvider;

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

    // new endpoint backing
    public String enableMfa(HttpServletResponse res) {
        User user = currentUser();
        if (user.isTotpEnabled()) {
            throw new BusinessException("MFA is already enabled");
        }

        this.initiateMfa(user);   // generate code → save → email (existing method)

        String mfaToken = jwtTokenProvider.generateMfaToken(user.getUsername(), "ENABLE");

        ResponseCookie mfaCookie = ResponseCookie.from("preAuthToken", mfaToken)
                .httpOnly(true)
                .secure(false)
                .path("/mfa/verify")          // same path as login → browser sends it on verify
                .sameSite("Lax")
                .maxAge(5 * 60)               // 5 minutes, matches token expiry
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, mfaCookie.toString());

        return "MFA activation code sent to your email";
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BusinessException("Not authenticated");
        }
        return userRepository.findUserByUsername(auth.getName());
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
