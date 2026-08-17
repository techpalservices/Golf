package com.golf.golf_project.users.services;

import com.golf.golf_project.auth.dto.requests.SignUpDTORequest;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.role.repositories.RoleRepository;
import com.golf.golf_project.shared.services.UploadService;
import com.golf.golf_project.users.dto.requests.ChangeUserStatusRequest;
import com.golf.golf_project.users.dto.requests.SearchPagableRequest;
import com.golf.golf_project.users.dto.requests.SearchUserRequest;
import com.golf.golf_project.users.dto.requests.UpdateUserDataRequest;
import com.golf.golf_project.users.dto.responce.ManagerDataResponse;
import com.golf.golf_project.users.dto.responce.UserDataManagementResponse;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import com.golf.golf_project.users.mappers.UserMapper;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final ClubRepository clubRepository;
    private final UploadService uploadService;

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

        EUGender gender = parseEnum(request.gender(), EUGender.class);
        EUStatus status = parseEnum(request.status(), EUStatus.class);
        Role role = (request.role() == null || request.role().isBlank())
                ? null
                : roleRepository.findByName(request.role());

        Page<User> userPage = userRepository.searchUsers(
                wrapLike(request.firstName()),   // "jhon" → "%jhon%", null → null
                wrapLike(request.lastName()),
                wrapLike(request.email()),
                wrapLike(request.phoneNumber()),
                gender,
                status,
                role,
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

    public void updateUserDate(UpdateUserDataRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        String username = auth.getName();
        User user = userRepository.findUserByUsername(username);

        if (hasText(request.firstName())) {
            user.setFirstName(request.firstName());
        }

        if (hasText(request.lastName())) {
            user.setLastName(request.lastName());
        }

        if (request.gender() != null) {
            user.setGender(request.gender());
        }

        if (hasText(request.bio())) {
            user.setBio(request.bio());
        }

        if (request.birthDate() != null) {
            user.setBirthDate(request.birthDate());
        }

        if (request.phoneNumber() != null) {
            user.setPhoneNumber(request.phoneNumber());
        }

        userRepository.save(user);
    }

    public void updatePP(MultipartFile profilePic) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        String username = auth.getName();
        User user = userRepository.findUserByUsername(username);

        if (profilePic != null) user.setAvatarURL(this.uploadService.uploadFile(profilePic));

        userRepository.save(user);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String wrapLike(String value) {
        return value == null ? null : "%" + value.toLowerCase() + "%";
    }

    private <T extends Enum<T>> T parseEnum(String value, Class<T> enumClass) {
        if (value == null || value.isBlank()) return null;
        try {
            return Enum.valueOf(enumClass, value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
