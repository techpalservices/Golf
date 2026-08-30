package com.golf.golf_project.reservations.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.exeptions.entities.ResourceNotFoundException;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.enums.EMStatus;
import com.golf.golf_project.notifications.enums.ENotificationType;
import com.golf.golf_project.notifications.services.NotificationService;
import com.golf.golf_project.reservations.dto.requests.CreateReservationRequest;
import com.golf.golf_project.reservations.dto.requests.UpdateReservationStatusRequest;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import com.golf.golf_project.reservations.repositories.ReservationRepository;
import com.golf.golf_project.role.entities.Role;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.enums.ETStatus;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Pure unit tests for ReservationService — no Spring context, no database.
 * All collaborators (repositories, NotificationService) are Mockito mocks.
 */
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock private ReservationRepository reservationRepository;
    @Mock private TimeSlotRepository timeSlotRepository;
    @Mock private UserRepository userRepository;
    @Mock private com.golf.golf_project.courses.repositories.CourseRepository courseRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks private ReservationService reservationService;

    private static final LocalDateTime START =
            LocalDate.of(2026, 9, 1).atTime(10, 0);

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // ── helpers ──────────────────────────────────────────────

    /** Fakes a logged-in user the way Spring Security would. */
    private void loginAs(String username) {
        // 3-arg constructor = authenticated token (2-arg version is "unauthenticated")
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(username, null, List.of()));
    }

    private User user(String roleName) {
        Role role = new Role();
        role.setName(roleName);
        User u = new User();
        u.setId(UUID.randomUUID());
        u.setRole(role);
        u.setFirstName("Ali");
        u.setLastName("Test");
        return u;
    }

    private Course courseWithClub() {
        Club club = new Club();
        club.setId(UUID.randomUUID());
        Course course = new Course();
        course.setId(UUID.randomUUID());
        course.setName("Course A");
        course.setClub(club);
        return course;
    }

    private TimeSlot slot(Course course, ETStatus status, List<Reservation> reservations) {
        TimeSlot ts = new TimeSlot();
        ts.setId(UUID.randomUUID());
        ts.setCourse(course);
        ts.setStartTime(START);
        ts.setStatus(status);
        ts.setReservations(reservations);
        return ts;
    }

    private Reservation res(User player, ERStatus status, int players) {
        Reservation r = new Reservation();
        r.setPlayer(player);
        r.setStatus(status);
        r.setNumberOfPlayers(players);
        return r;
    }

    private CreateReservationRequest req(Course course, int players) {
        return new CreateReservationRequest(START, course.getId(), players);
    }

    // ── 1. auth guard ────────────────────────────────────────

    @Test
    @DisplayName("createReservation: unauthenticated user is rejected")
    void create_whenNotAuthenticated_throws() {
        assertThatThrownBy(() -> reservationService.createReservation(
                        new CreateReservationRequest(START, UUID.randomUUID(), 1)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Not authenticated");
    }

    // ── 2. role guard ────────────────────────────────────────

    @Test
    @DisplayName("createReservation: only ROLE_PLAYER can book")
    void create_whenNotPlayer_throws() {
        loginAs("manager1");
        User manager = user("ROLE_MANAGER");
        when(userRepository.findUserByUsername("manager1")).thenReturn(manager);

        assertThatThrownBy(() -> reservationService.createReservation(
                        new CreateReservationRequest(START, UUID.randomUUID(), 1)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Only players can book");
    }

    // ── 3. course exists ─────────────────────────────────────

    @Test
    @DisplayName("createReservation: unknown course -> 404")
    void create_whenCourseNotFound_throws() {
        loginAs("player1");
        when(userRepository.findUserByUsername("player1")).thenReturn(user("ROLE_PLAYER"));
        when(courseRepository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.createReservation(
                        new CreateReservationRequest(START, UUID.randomUUID(), 1)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Course not found");
    }

    // ── 4. one reservation per club per day ──────────────────

    @Test
    @DisplayName("createReservation: second booking at same club same day is blocked")
    void create_whenAlreadyBookedSameDay_throws() {
        loginAs("player1");
        User player = user("ROLE_PLAYER");
        Course course = courseWithClub();
        when(userRepository.findUserByUsername("player1")).thenReturn(player);
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(reservationRepository.existsByPlayerAndClubOnDate(
                eq(player.getId()), eq(course.getClub().getId()), any(), any(), anyList()))
                .thenReturn(true);

        assertThatThrownBy(() -> reservationService.createReservation(req(course, 1)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("only book one slot per club per day");
    }

    // ── 5. closed slot ───────────────────────────────────────

    @Test
    @DisplayName("createReservation: CLOSED slot is rejected")
    void create_whenSlotClosed_throws() {
        loginAs("player1");
        Course course = courseWithClub();
        when(userRepository.findUserByUsername("player1")).thenReturn(user("ROLE_PLAYER"));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(reservationRepository.existsByPlayerAndClubOnDate(
                any(), any(), any(), any(), anyList())).thenReturn(false);
        when(timeSlotRepository.findByCourseAndStartTime(course, START))
                .thenReturn(Optional.of(slot(course, ETStatus.CLOSED, List.of())));

        assertThatThrownBy(() -> reservationService.createReservation(req(course, 1)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("closed");
    }

    // ── 6. capacity: PENDING+ACCEPTED count, REJECTED don't ──

    @Test
    @DisplayName("createReservation: full slot (4/4) rejects one more player")
    void create_whenCapacityExceeded_throws() {
        loginAs("player1");
        Course course = courseWithClub();
        User other = user("ROLE_PLAYER");
        TimeSlot full = slot(course, ETStatus.OPEN, List.of(
                res(other, ERStatus.ACCEPTED, 2),
                res(other, ERStatus.PENDING, 2)));
        when(userRepository.findUserByUsername("player1")).thenReturn(user("ROLE_PLAYER"));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(reservationRepository.existsByPlayerAndClubOnDate(
                any(), any(), any(), any(), anyList())).thenReturn(false);
        when(timeSlotRepository.findByCourseAndStartTime(course, START))
                .thenReturn(Optional.of(full));

        assertThatThrownBy(() -> reservationService.createReservation(req(course, 1)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("exceeds the maximum");
    }

    // ── 7. non-member -> PENDING + owner notified ────────────

    @Test
    @DisplayName("createReservation: non-member is saved PENDING and manager notified")
    void create_nonMember_savesPendingAndNotifiesOwner() {
        loginAs("player1");
        User player = user("ROLE_PLAYER");              // membership = null
        Course course = courseWithClub();
        User owner = user("ROLE_MANAGER");
        course.getClub().setOwner(owner);
        TimeSlot empty = slot(course, ETStatus.OPEN, null);
        when(userRepository.findUserByUsername("player1")).thenReturn(player);
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(reservationRepository.existsByPlayerAndClubOnDate(
                any(), any(), any(), any(), anyList())).thenReturn(false);
        when(timeSlotRepository.findByCourseAndStartTime(course, START))
                .thenReturn(Optional.of(empty));
        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        reservationService.createReservation(req(course, 2));

        ArgumentCaptor<Reservation> saved = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(saved.capture());
        assertThat(saved.getValue().getStatus()).isEqualTo(ERStatus.PENDING);
        assertThat(saved.getValue().getNumberOfPlayers()).isEqualTo(2);
        assertThat(saved.getValue().getPlayer()).isEqualTo(player);
        verify(notificationService).send(
                eq(owner), contains("demande"), anyString(),
                eq(ENotificationType.RESERVATION_REQUESTED));
    }

    // ── 8. active member of this club -> ACCEPTED instantly ──

    @Test
    @DisplayName("createReservation: active member is auto-ACCEPTED and confirmed")
    void create_activeMember_savesAccepted() {
        loginAs("player1");
        User player = user("ROLE_PLAYER");
        Course course = courseWithClub();
        course.getClub().setOwner(user("ROLE_MANAGER"));
        Membership membership = new Membership();
        membership.setStatus(EMStatus.ACTIVE);
        membership.setClub(course.getClub());
        player.setMembership(membership);
        TimeSlot empty = slot(course, ETStatus.OPEN, List.of());
        when(userRepository.findUserByUsername("player1")).thenReturn(player);
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(reservationRepository.existsByPlayerAndClubOnDate(
                any(), any(), any(), any(), anyList())).thenReturn(false);
        when(timeSlotRepository.findByCourseAndStartTime(course, START))
                .thenReturn(Optional.of(empty));
        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        reservationService.createReservation(req(course, 1));

        ArgumentCaptor<Reservation> saved = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(saved.capture());
        assertThat(saved.getValue().getStatus()).isEqualTo(ERStatus.ACCEPTED);
        verify(notificationService).send(
                eq(player), contains("confirm"), anyString(),
                eq(ENotificationType.RESERVATION_CONFIRMED));
    }

    // ── 9. reject flow ───────────────────────────────────────

    @Test
    @DisplayName("updateReservationStatus: manager reject saves REJECTED and notifies player")
    void reject_savesRejectedAndNotifies() {
        loginAs("manager1");
        User manager = user("ROLE_MANAGER");
        User player = user("ROLE_PLAYER");
        Course course = courseWithClub();
        course.getClub().setOwner(manager);
        TimeSlot ts = slot(course, ETStatus.OPEN, null);
        Reservation reservation = res(player, ERStatus.PENDING, 2);
        reservation.setTimeSlot(ts);
        when(userRepository.findUserByUsername("manager1")).thenReturn(manager);
        when(reservationRepository.findById(reservation.getId()))
                .thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        int result = reservationService.updateReservationStatus(
                new UpdateReservationStatusRequest(reservation.getId(), ERStatus.REJECTED));

        assertThat(result).isZero();
        assertThat(reservation.getStatus()).isEqualTo(ERStatus.REJECTED);
        verify(notificationService).send(
                eq(player), contains("refus"), anyString(),
                eq(ENotificationType.RESERVATION_REJECTED));
    }

    // ── 10. ownership guard ──────────────────────────────────

    @Test
    @DisplayName("updateReservationStatus: manager of another club is blocked")
    void reject_byOtherClubManager_throws() {
        loginAs("manager1");
        User manager = user("ROLE_MANAGER");
        User realOwner = user("ROLE_MANAGER");
        Course course = courseWithClub();
        course.getClub().setOwner(realOwner);          // not "manager1"
        Reservation reservation = res(user("ROLE_PLAYER"), ERStatus.PENDING, 2);
        reservation.setTimeSlot(slot(course, ETStatus.OPEN, null));
        when(userRepository.findUserByUsername("manager1")).thenReturn(manager);
        when(reservationRepository.findById(reservation.getId()))
                .thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.updateReservationStatus(
                        new UpdateReservationStatusRequest(reservation.getId(), ERStatus.REJECTED)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("owner of the club");
    }
}
