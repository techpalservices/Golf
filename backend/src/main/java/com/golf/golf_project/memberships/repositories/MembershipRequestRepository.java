package com.golf.golf_project.memberships.repositories;

import com.golf.golf_project.memberships.entities.MembershipRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, UUID> {
}
