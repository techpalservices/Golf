package com.golf.golf_project.role.repositories;

import com.golf.golf_project.role.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByName(String name);
}
