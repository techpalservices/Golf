package com.golf.golf_project.email.services;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public void sendMfaCode(String toEmail, String code) {
        try {
            Context context = new Context();
            context.setVariable("code", code);

            String html = templateEngine.process("mfa-email", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Your Verification Code");
            helper.setText(html, true);

            mailSender.send(message);
            log.info("MFA code email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send MFA email to {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}