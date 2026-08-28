    package com.golf.golf_project.memberships.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.memberships.dto.requests.SearchMembershipRequestsRequest;
import com.golf.golf_project.memberships.dto.responses.ClubMemberResponse;
import com.golf.golf_project.memberships.dto.responses.SearchMembershipRequestsResponse;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.entities.MembershipRequest;
import com.golf.golf_project.memberships.enums.EMRStatus;
import com.golf.golf_project.memberships.mappers.MembershipRequestMapper;
import com.golf.golf_project.memberships.repositories.MembershipRepository;
import com.golf.golf_project.memberships.repositories.MembershipRequestRepository;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.notifications.services.NotificationService;
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
    private final NotificationService notificationService;

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

    /**
     * Members of the manager's club = players whose membership request
     * has been ACCEPTED. Supports filtering by plan name + pagination.
     */
    public List<ClubMemberResponse> getClubMembers(SearchMembershipRequestsRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        User user = userRepository.findUserByUsername(auth.getName());

        if (user == null) throw new IllegalArgumentException("User not found");
        else if (!user.getRole().getName().equals("ROLE_MANAGER")) throw new IllegalArgumentException("User must be manager");

        Club club = clubRepository.findClubByOwnerUsername(auth.getName());
        if (club == null) throw new IllegalArgumentException("Manager has no club assigned - assign him via Admin first");

        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());

        Page<MembershipRequest> members = membershipRequestRepository.searchClubMembers(
                club.getId(),
                wrapLike(request.planName()),
                pageable
        );

        return members.getContent().stream()
                .map(membershipRequestMapper::toClubMemberResponse)
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

        // Notify the club manager that a membership request arrived
        Club club = membershipRequest.getMembership().getClub();
        if (club != null && club.getOwner() != null) {
            notificationService.send(
                    club.getOwner(),
                    "Nouvelle demande d'adhésion",
                    user.getFirstName() + " " + user.getLastName() + " demande à rejoindre le formule « "
                            + membershipRequest.getMembership().getTitle() + " ».",
                    ENotificationType.MEMBERSHIP_REQUESTED);
        }
    }

    public void acceptRequest(UUID requestId) {
        MembershipRequest membershipRequest = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Membership request not found"));
        Membership membership = membershipRequest.getMembership();
        User player = membershipRequest.getPlayer();

        // Maintain both sides of the bidirectional relation so the player is
        // actually linked to the membership (and thus a member of the club)
        membership.getPlayers().add(player);
        player.setMembership(membership);

        membershipRequest.setStatus(EMRStatus.ACCEPTED);

        membershipRepository.save(membership);
        membershipRequestRepository.save(membershipRequest);
        userRepository.save(player);

        notificationService.send(
                player,
                "Demande d'adhésion acceptée",
                "Félicitations ! Votre demande d'adhésion au club "
                        + (membership.getClub() != null ? membership.getClub().getName() : "")
                        + " (formule « " + membership.getTitle() + " ») a été acceptée. Vous êtes maintenant membre !",
                ENotificationType.MEMBERSHIP_APPROVED);
    }

    public void rejectRequest(UUID requestId) {
        MembershipRequest membershipRequest = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Membership request not found"));
        membershipRequest.setStatus(EMRStatus.REJECTED);
        membershipRequestRepository.save(membershipRequest);

        User player = membershipRequest.getPlayer();
        String title = membershipRequest.getMembership() != null ? membershipRequest.getMembership().getTitle() : "";
        notificationService.send(
                player,
                "Demande d'adhésion refusée",
                "Votre demande d'adhésion (formule « " + title + " ») n'a malheureusement pas été retenue.",
                ENotificationType.MEMBERSHIP_REJECTED);
    }

    private String wrapLike(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return "%" + value.trim().toLowerCase() + "%";
    }
}
