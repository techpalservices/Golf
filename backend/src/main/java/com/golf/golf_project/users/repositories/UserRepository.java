package com.golf.golf_project.users.repositories;

import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUGender;
import com.golf.golf_project.users.enums.EUStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findUserByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findUserByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.role r " +
            "WHERE r.name <> 'ROLE_ADMIN' " +
            "AND (:firstName IS NULL OR LOWER(u.firstName) LIKE :firstName) " +
            "AND (:lastName IS NULL OR LOWER(u.lastName) LIKE :lastName) " +
            "AND (:email IS NULL OR LOWER(u.email) LIKE :email) " +
            "AND (:phone IS NULL OR u.phoneNumber LIKE :phone) " +
            "AND (:gender IS NULL OR u.gender = :gender) " +
            "AND (:status IS NULL OR u.status = :status) " +
            "AND (:role IS NULL OR r = :role) "
    )
    Page<User> searchUsers(
            String firstName,
            String lastName,
            String email,
            String phone,
            EUGender gender,
            EUStatus status,
            Role role,
            Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.role r " +
            "WHERE r.name = 'ROLE_MANAGER'"
    )
    List<User> findUserByRole(Role role, Pageable pageable);
}
