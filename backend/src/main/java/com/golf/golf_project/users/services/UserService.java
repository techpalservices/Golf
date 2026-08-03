package com.golf.golf_project.users.services;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.users.dto.requests.ChangeUserStatusRequest;
import com.golf.golf_project.users.dto.requests.SearchPagableRequest;
import com.golf.golf_project.users.dto.requests.SearchUserRequest;
import com.golf.golf_project.users.dto.responce.ManagerDataResponse;
import com.golf.golf_project.users.dto.responce.UserDataManagementResponse;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUStatus;
import com.golf.golf_project.users.mappers.UserMapper;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final ClubRepository clubRepository;

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

    public List<UserDataManagementResponse> getUsers(SearchUserRequest request) {
        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());

        Page<User> userPage = userRepository.searchUsers(
                wrapLike(request.firstName()),   // "jhon" → "%jhon%", null → null
                wrapLike(request.lastName()),
                wrapLike(request.email()),
                wrapLike(request.phoneNumber()),
                request.gender(),
                request.status(),
                request.role(),
                pageable
        );
        return userPage.getContent().stream()
                .map(userMapper::toUserDataManagementResponse)
                .collect(Collectors.toList());
    }

    public List<ManagerDataResponse> getManagers(SearchPagableRequest request) {
        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());

        Role managerRole = roleRepository.findByName("ROLE_MANAGER");

        List<User> managers = new ArrayList<>(userRepository.findUserByRole(managerRole, pageable));

        return managers.stream()
                .filter(user -> !clubRepository.existsByOwner(user))
                .map(userMapper::toManagerDataResponse)
                .collect(Collectors.toList());
    }

    public void changeUserStatus(ChangeUserStatusRequest request) {
        User user = userRepository.findById(request.userId()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(request.status());
        userRepository.save(user);
    }

    private String wrapLike(String value) {
        return value == null ? null : "%" + value.toLowerCase() + "%";
    }
}
