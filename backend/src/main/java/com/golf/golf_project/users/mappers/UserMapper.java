package com.golf.golf_project.users.mappers;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.dto.responce.UserDataManagementResponse;
import com.golf.golf_project.users.entities.User;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class UserMapper {

    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public User toUser (SignUpDTORequest request) {
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setGender(request.gender());
        user.setEmail(request.email());
        user.setPhoneNumber(request.phoneNumber());
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(roleRepository.findByName("ROLE_MANAGER"));
        return user;
    }

    public UserDataManagementResponse toUserDataManagementResponse(User user) {
        return new UserDataManagementResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus(),
                user.getGender(),
                user.getAvatarURL(),
                user.getBirthDate(),
                user.getRole().getName()
        );
    }
}
