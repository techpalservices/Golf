package com.golf.golf_project.users.services;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.dto.responce.UserDataManagementResponse;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.mappers.UserMapper;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
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

    public List<UserDataManagementResponse> getUsers() {
        Role playerRole = roleRepository.findByName("ROLE_PLAYER");
        Role managerRole = roleRepository.findByName("ROLE_MANAGER");

        List<User> players = new ArrayList<>(userRepository.findUserByRole(playerRole));
        List<User> managers = new ArrayList<>(userRepository.findUserByRole(managerRole));

        List<User> players_Managers = new ArrayList<>(players);
        players_Managers.addAll(managers);

        System.out.println("players: " + players);
        System.out.println("managers: " + managers);

        System.out.println("Players and Managers: " + players_Managers);

        return players_Managers.stream()
                .map(userMapper::toUserDataManagementResponse)
                .collect(Collectors.toList());
    }
}
