package com.golf.golf_project.memberships.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.memberships.dto.requests.CreateMembershipRequest;
import com.golf.golf_project.memberships.dto.requests.SearchMembershipRequest;
import com.golf.golf_project.memberships.dto.requests.SearchMyMembershipsRequest;
import com.golf.golf_project.memberships.services.MembershipService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/memberships")
@AllArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @PostMapping("/getMemberships")
    public ResponseEntity<?> getMemberships(
            @RequestBody SearchMembershipRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(membershipService.getAllMemberships(request))
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/getMyMemberships")
    public ResponseEntity<?> getMyMemberships(
            @RequestBody SearchMyMembershipsRequest request
            ) {
        return ResponseEntity.ok(
                ApiResponse.success(membershipService.getMyMemberships(request))
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/add")
    public ResponseEntity<?> createMembership(
            @Valid @RequestBody CreateMembershipRequest request
    ) {
        membershipService.createMembership(request);
        return ResponseEntity.ok(
                ApiResponse.success("Membership created successfully")
        );
    }
}
