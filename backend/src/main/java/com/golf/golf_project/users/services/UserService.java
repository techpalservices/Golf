package com.golf.golf_project.users.services;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.mappers.UserMapper;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public boolean AddManager(SignUpDTORequest signUpDTORequest) {
        if (userRepository.existsByUsername(signUpDTORequest.username())) {
            throw new RuntimeException("Username already taken");
        }

        if (userRepository.existsByEmail(signUpDTORequest.email())) {
            throw new RuntimeException("Email already taken");
        }

        User savedManager = userRepository.save(userMapper.toUser(signUpDTORequest));

        if (savedManager == null) {
            throw new RuntimeException("User not found");
        }

        return true;
    }
}
