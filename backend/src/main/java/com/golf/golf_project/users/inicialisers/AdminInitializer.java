package com.golf.golf_project.users.inicialisers;

import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@golfclub.com}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:#{Admin52341}}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        // Fail safe: if no password configured, skip
        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("ADMIN_PASSWORD not set — skipping admin account creation");
            log.warn("Set ADMIN_PASSWORD in your .env file to auto-create the admin");
            return;
        }

        // Check if admin already exists (idempotent)
        if (userRepository.findUserByEmail(adminEmail) != null) {
            log.info("Admin account already exists for: {}", adminEmail);
            return;
        }

        // Create ROLE_ADMIN if it doesn't exist
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        Role playerRole = roleRepository.findByName("ROLE_PLAYER");
        Role managerRole = roleRepository.findByName("ROLE_MANAGER");
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            adminRole = roleRepository.save(adminRole);
            log.info("Created ROLE_ADMIN role");
        }

        if (playerRole == null) {
            playerRole = new Role();
            playerRole.setName("ROLE_PLAYER");
            roleRepository.save(playerRole);
            log.info("Created ROLE_PLAYER role");
        }

        if (managerRole == null) {
            managerRole = new Role();
            managerRole.setName("ROLE_MANAGER");
            roleRepository.save(managerRole);
            log.info("Created ROLE_MANAGER role");
        }

        // Create admin user
        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setUsername(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setFirstName("Admin");
        admin.setLastName("GolfClub");
        admin.setStatus(EUStatus.ACTIVE);
        admin.setGender(EUGender.MALE);
        admin.setRole(adminRole);

        userRepository.save(admin);
        log.info("✅ Admin account created with email: {}", adminEmail);
    }
}