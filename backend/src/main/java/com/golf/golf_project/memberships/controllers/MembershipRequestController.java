package com.golf.golf_project.memberships.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.memberships.dto.requests.SearchMembershipRequestsRequest;
import com.golf.golf_project.memberships.services.MembershipRequestService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/memberships-requests")
@AllArgsConstructor
public class MembershipRequestController {

    private final MembershipRequestService membershipRequestService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/all")
    public ResponseEntity<?> createMembershipRequest(
            @RequestBody SearchMembershipRequestsRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(membershipRequestService.getAllMembershipRequests(request))
        );
    }

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/request")
    public ResponseEntity<?> createMembershipRequest(
            @RequestParam UUID membershipId
    ) {
        membershipRequestService.CreateRequest(membershipId);
        return ResponseEntity.ok(ApiResponse.success("Membership request created successfully"));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/accept")
    public ResponseEntity<?> acceptMembershipRequest(
            @RequestParam UUID requestId
    ) {
        membershipRequestService.acceptRequest(requestId);
        return ResponseEntity.ok(ApiResponse.success("Membership request accepted successfully"));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/reject")
    public ResponseEntity<?> rejectMembershipRequest(
            @RequestParam UUID requestId
    ) {
        membershipRequestService.rejectRequest(requestId);
        return ResponseEntity.ok(ApiResponse.success("Membership request rejected successfully"));
    }
}
