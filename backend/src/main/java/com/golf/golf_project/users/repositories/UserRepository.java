package com.golf.golf_project.users.repositories;

import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.users.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findUserByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findUserByEmail(String email);

    List<User> findUserByRole(Role role);

    User findByIdAndRole(UUID id, Role role);
}
