package com.golf.golf_project.users.repositories;

import com.golf.golf_project.users.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findUserByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
