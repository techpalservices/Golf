package com.golf.golf_project.memberships.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.memberships.dto.requests.SearchMembershipRequestsRequest;
import com.golf.golf_project.memberships.dto.responses.SearchMembershipRequestsResponse;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.entities.MembershipRequest;
import com.golf.golf_project.memberships.enums.EMRStatus;
import com.golf.golf_project.memberships.mappers.MembershipRequestMapper;
import com.golf.golf_project.memberships.repositories.MembershipRepository;
import com.golf.golf_project.memberships.repositories.MembershipRequestRepository;
import com.golf.golf_project.users.entities.User;
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

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class MembershipRequestService {

    private final MembershipRequestRepository membershipRequestRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final MembershipRequestMapper membershipRequestMapper;
    private final ClubRepository clubRepository;

    public List<SearchMembershipRequestsResponse> getAllMembershipRequests(SearchMembershipRequestsRequest request) {
        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        User user = userRepository.findUserByUsername(auth.getName());

        if (user == null) throw new IllegalArgumentException("User not found");
        else if (!user.getRole().getName().equals("ROLE_MANAGER")) throw new IllegalArgumentException("User must be manager");

        Club club = clubRepository.findClubByOwnerUsername(auth.getName());
        if (club == null) throw new IllegalArgumentException("Manager has no club assigned - assign him via Admin first");

        Page<MembershipRequest> membershipRequests = membershipRequestRepository.searchMembershipsRequests(
                wrapLike(request.firstName()),
                wrapLike(request.lastName()),
                wrapLike(request.planName()),
                request.status(),
                club.getId(),
                pageable
        );

        return membershipRequests.getContent().stream()
                .map(membershipRequestMapper::toSearchMembershipRequestsResponse)
                .toList();
    }

    public void CreateRequest(UUID membershipId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        User user = userRepository.findUserByUsername(auth.getName());

        if (user == null) throw new IllegalArgumentException("User not found");
        else if (!user.getRole().getName().equals("ROLE_PLAYER")) throw new IllegalArgumentException("User must be player");

        MembershipRequest membershipRequest = new MembershipRequest();
        membershipRequest.setMembership(membershipRepository.findById(membershipId).orElseThrow(() -> new IllegalArgumentException("Membership not found")));
        membershipRequest.setPlayer(user);
        membershipRequest.setStatus(EMRStatus.PENDING);

        membershipRequestRepository.save(membershipRequest);
    }

    public void acceptRequest(UUID requestId) {
        MembershipRequest membershipRequest = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Membership request not found"));
        Membership membership = membershipRequest.getMembership();
        membership.getPlayers().add(membershipRequest.getPlayer());

        membershipRequest.setStatus(EMRStatus.ACCEPTED);

        membershipRepository.save(membership);
        membershipRequestRepository.save(membershipRequest);
    }

    public void rejectRequest(UUID requestId) {
        MembershipRequest membershipRequest = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Membership request not found"));
        membershipRequest.setStatus(EMRStatus.REJECTED);
        membershipRequestRepository.save(membershipRequest);
    }

    private String wrapLike(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return "%" + value.trim().toLowerCase() + "%";
    }
}
