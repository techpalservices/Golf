package com.golf.golf_project.memberships.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.memberships.dto.requests.SearchMembershipRequestsRequest;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.entities.MembershipRequest;
import com.golf.golf_project.memberships.enums.EMRStatus;
import com.golf.golf_project.memberships.mappers.MembershipRequestMapper;
import com.golf.golf_project.memberships.repositories.MembershipRepository;
import com.golf.golf_project.memberships.repositories.MembershipRequestRepository;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.notifications.services.NotificationService;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for MembershipRequestService — mocks only, no database.
 * Covers the request lifecycle: create (pending) -> accept / reject.
 */
@ExtendWith(MockitoExtension.class)
class MembershipRequestServiceTest {

    @Mock private MembershipRequestRepository membershipRequestRepository;
    @Mock private MembershipRepository membershipRepository;
    @Mock private UserRepository userRepository;
    @Mock private MembershipRequestMapper membershipRequestMapper;
    @Mock private ClubRepository clubRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks private MembershipRequestService service;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // ── helpers ──────────────────────────────────────────────

    private void loginAs(String username) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(username, null, List.of()));
    }

    private User user(String roleName) {
        Role role = new Role();
        role.setName(roleName);
        User u = new User();
        u.setId(UUID.randomUUID());
        u.setRole(role);
        u.setFirstName("Sami");
        u.setLastName("Test");
        return u;
    }

    private Membership membershipWithClub() {
        Club club = new Club();
        club.setId(UUID.randomUUID());
        club.setName("Royal Golf");
        Membership m = new Membership();
        m.setId(UUID.randomUUID());
        m.setTitle("Gold");
        m.setClub(club);
        return m;
    }

    // ── CreateRequest (player asks to join a club) ───────────

    @Test
    @DisplayName("CreateRequest: unauthenticated user is rejected")
    void createRequest_whenNotAuthenticated_throws() {
        assertThatThrownBy(() -> service.CreateRequest(UUID.randomUUID()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Not authenticated");
    }

    @Test
    @DisplayName("CreateRequest: only ROLE_PLAYER can request membership")
    void createRequest_whenNotPlayer_throws() {
        loginAs("manager1");
        when(userRepository.findUserByUsername("manager1")).thenReturn(user("ROLE_MANAGER"));

        assertThatThrownBy(() -> service.CreateRequest(UUID.randomUUID()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User must be player");
    }

    @Test
    @DisplayName("CreateRequest: unknown membership plan -> 'Membership not found'")
    void createRequest_whenMembershipNotFound_throws() {
        loginAs("player1");
        when(userRepository.findUserByUsername("player1")).thenReturn(user("ROLE_PLAYER"));
        when(membershipRepository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.CreateRequest(UUID.randomUUID()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Membership not found");
    }

    @Test
    @DisplayName("CreateRequest: success -> saved PENDING and club owner notified")
    void createRequest_success_savesPendingAndNotifiesOwner() {
        loginAs("player1");
        User player = user("ROLE_PLAYER");
        Membership membership = membershipWithClub();
        User owner = user("ROLE_MANAGER");
        membership.getClub().setOwner(owner);
        when(userRepository.findUserByUsername("player1")).thenReturn(player);
        when(membershipRepository.findById(membership.getId()))
                .thenReturn(Optional.of(membership));

        service.CreateRequest(membership.getId());

        ArgumentCaptor<MembershipRequest> saved =
                ArgumentCaptor.forClass(MembershipRequest.class);
        verify(membershipRequestRepository).save(saved.capture());
        assertThat(saved.getValue().getStatus()).isEqualTo(EMRStatus.PENDING);
        assertThat(saved.getValue().getPlayer()).isEqualTo(player);
        assertThat(saved.getValue().getMembership()).isEqualTo(membership);
        verify(notificationService).send(
                eq(owner), contains("adhésion"), anyString(),
                eq(ENotificationType.MEMBERSHIP_REQUESTED));
    }

    // ── acceptRequest ────────────────────────────────────────

    @Test
    @DisplayName("acceptRequest: player becomes a member of the club and is notified")
    void acceptRequest_linksPlayerToMembershipAndNotifies() {
        User player = user("ROLE_PLAYER");
        Membership membership = membershipWithClub();
        membership.setPlayers(new ArrayList<>());       // bidirectional side must exist
        MembershipRequest request = new MembershipRequest();
        request.setMembership(membership);
        request.setPlayer(player);
        request.setStatus(EMRStatus.PENDING);
        when(membershipRequestRepository.findById(request.getId()))
                .thenReturn(Optional.of(request));

        service.acceptRequest(request.getId());

        assertThat(request.getStatus()).isEqualTo(EMRStatus.ACCEPTED);
        assertThat(player.getMembership()).isEqualTo(membership);   // player linked
        assertThat(membership.getPlayers()).contains(player);       // reverse side too
        verify(membershipRepository).save(membership);
        verify(membershipRequestRepository).save(request);
        verify(userRepository).save(player);
        verify(notificationService).send(
                eq(player), contains("acceptée"), anyString(),
                eq(ENotificationType.MEMBERSHIP_APPROVED));
    }

    @Test
    @DisplayName("acceptRequest: unknown request -> error")
    void acceptRequest_whenNotFound_throws() {
        when(membershipRequestRepository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.acceptRequest(UUID.randomUUID()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    // ── rejectRequest ────────────────────────────────────────

    @Test
    @DisplayName("rejectRequest: status becomes REJECTED and player is notified")
    void rejectRequest_setsRejectedAndNotifiesPlayer() {
        Membership membership = membershipWithClub();
        User player = user("ROLE_PLAYER");
        MembershipRequest request = new MembershipRequest();
        request.setMembership(membership);
        request.setPlayer(player);
        request.setStatus(EMRStatus.PENDING);
        when(membershipRequestRepository.findById(request.getId()))
                .thenReturn(Optional.of(request));

        service.rejectRequest(request.getId());

        assertThat(request.getStatus()).isEqualTo(EMRStatus.REJECTED);
        verify(membershipRequestRepository).save(request);
        verify(notificationService).send(
                eq(player), contains("refusée"), anyString(),
                eq(ENotificationType.MEMBERSHIP_REJECTED));
    }

    // ── getAllMembershipRequests (manager view) ──────────────

    @Test
    @DisplayName("getAllMembershipRequests: non-manager is rejected")
    void getAll_whenNotManager_throws() {
        loginAs("player1");
        when(userRepository.findUserByUsername("player1")).thenReturn(user("ROLE_PLAYER"));

        assertThatThrownBy(() -> service.getAllMembershipRequests(searchRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User must be manager");
    }

    @Test
    @DisplayName("getAllMembershipRequests: manager without a club is rejected")
    void getAll_whenManagerHasNoClub_throws() {
        loginAs("manager1");
        when(userRepository.findUserByUsername("manager1")).thenReturn(user("ROLE_MANAGER"));
        when(clubRepository.findClubByOwnerUsername("manager1")).thenReturn(null);

        assertThatThrownBy(() -> service.getAllMembershipRequests(searchRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("no club assigned");
    }

    @Test
    @DisplayName("getAllMembershipRequests: manager gets his club's requests, mapped")
    void getAll_success_returnsMappedRequests() {
        loginAs("manager1");
        Club club = new Club();
        club.setId(UUID.randomUUID());
        Membership membership = membershipWithClub();
        MembershipRequest request = new MembershipRequest();
        request.setMembership(membership);
        request.setPlayer(user("ROLE_PLAYER"));
        request.setStatus(EMRStatus.PENDING);
        when(userRepository.findUserByUsername("manager1")).thenReturn(user("ROLE_MANAGER"));
        when(clubRepository.findClubByOwnerUsername("manager1")).thenReturn(club);
        when(membershipRequestRepository.searchMembershipsRequests(
                any(), any(), any(), any(), eq(club.getId()), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(request)));

        var result = service.getAllMembershipRequests(searchRequest());

        assertThat(result).hasSize(1);
        verify(membershipRequestMapper).toSearchMembershipRequestsResponse(request);
    }

    private SearchMembershipRequestsRequest searchRequest() {
        return new SearchMembershipRequestsRequest(null, null, null, null, 0, 10);
    }
}
