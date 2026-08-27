package com.golf.golf_project.reservations.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.exeptions.entities.ResourceNotFoundException;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.enums.EMStatus;
import com.golf.golf_project.reservations.dto.requests.CreateReservationRequest;
import com.golf.golf_project.reservations.dto.requests.UpdateReservationStatusRequest;
import com.golf.golf_project.reservations.dto.responses.ManagerReservationResponse;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import com.golf.golf_project.reservations.repositories.ReservationRepository;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.enums.ETStatus;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ReservationService {

    private static final int MAX_PLAYERS_PER_SLOT = 4;

    private final ReservationRepository reservationRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public void createReservation(CreateReservationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser"))
            throw new IllegalArgumentException("Not authenticated");

        User player = userRepository.findUserByUsername(auth.getName());
        if (!player.getRole().getName().equals("ROLE_PLAYER"))
            throw new BusinessException("Only players can book");

        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // One reservation per club per day
        UUID clubId = course.getClub().getId();
        LocalDate bookingDate = request.startTime().toLocalDate();
        boolean alreadyBooked = reservationRepository.existsByPlayerAndClubOnDate(
                player.getId(), clubId,
                bookingDate.atStartOfDay(), bookingDate.plusDays(1).atStartOfDay(),
                List.of(ERStatus.PENDING, ERStatus.ACCEPTED));
        if (alreadyBooked) {
            throw new BusinessException("You already have a reservation at this club on " + bookingDate
                    + ". You can only book one slot per club per day.");
        }

        // GET-OR-CREATE slot (your idea)
        TimeSlot timeSlot = timeSlotRepository.findByCourseAndStartTime(course, request.startTime())
                .orElseGet(() -> {
                    TimeSlot s = new TimeSlot();
                    s.setCourse(course);
                    s.setStartTime(request.startTime());
                    s.setEndTime(request.startTime().plusMinutes(5));
                    s.setStatus(ETStatus.OPEN);
                    return timeSlotRepository.save(s);
                });

        // Capacity check — only PENDING + ACCEPTED reservations hold places.
        // REJECTED reservations are auditable records only and free their seats.
        int totalPlayers = timeSlot.getReservations() == null ? 0
                : timeSlot.getReservations().stream()
                        .filter(r -> r.getStatus() == ERStatus.PENDING
                                || r.getStatus() == ERStatus.ACCEPTED)
                        .mapToInt(Reservation::getNumberOfPlayers)
                        .sum();
        if (totalPlayers + request.numberOfPlayers() > 4) // max players for a time slot is 4
            throw new BusinessException("The number of players exceeds the maximum allowed for this time slot");

        // Club members with an ACTIVE membership skip the approval queue —
        // their reservation is accepted immediately (the capacity check above
        // already guaranteed there are enough seats left).
        Membership membership = player.getMembership();
        boolean isActiveMember = membership != null
                && membership.getStatus() == EMStatus.ACTIVE
                && membership.getClub() != null
                && membership.getClub().getId().equals(clubId);

        Reservation reservation = new Reservation();
        reservation.setTimeSlot(timeSlot);
        reservation.setStatus(isActiveMember ? ERStatus.ACCEPTED : ERStatus.PENDING);
        reservation.setNumberOfPlayers(request.numberOfPlayers());
        reservation.setPlayer(player);
        reservationRepository.save(reservation);
    }

    /**
     * Manager decision on a reservation request.
     * REJECTED → no side effects, just this reservation.
     * ACCEPTED → validates remaining capacity first, then auto-rejects
     *            pending requests on the same slot that no longer fit.
     * @return the number of pending requests auto-rejected by this acceptance
     */
    @Transactional
    public int updateReservationStatus(UpdateReservationStatusRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser"))
            throw new IllegalArgumentException("Not authenticated");

        User manager = userRepository.findUserByUsername(auth.getName());
        if (!manager.getRole().getName().equals("ROLE_MANAGER"))
            throw new BusinessException("Only managers can update reservation status");

        Reservation reservation = reservationRepository.findById(request.id())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        Club club = reservation.getTimeSlot().getCourse().getClub();

        if (!club.getOwner().getId().equals(manager.getId()))
            throw new BusinessException("The requester must be the owner of the club");

        // Explicit reject — no side effects on other requests
        if (request.status() == ERStatus.REJECTED) {
            reservation.setStatus(ERStatus.REJECTED);
            reservationRepository.save(reservation);
            return 0;
        }

        if (request.status() == ERStatus.ACCEPTED) {
            TimeSlot timeSlot = reservation.getTimeSlot();

            // Capacity check BEFORE accepting — prevents overbooking a 4-seat slot
            int acceptedPlayers = timeSlot.getReservations() == null ? 0
                    : timeSlot.getReservations().stream()
                            .filter(r -> r.getStatus() == ERStatus.ACCEPTED)
                            .mapToInt(Reservation::getNumberOfPlayers)
                            .sum();
            int remaining = MAX_PLAYERS_PER_SLOT - acceptedPlayers;

            if (reservation.getNumberOfPlayers() > remaining) {
                throw new BusinessException(
                        "Not enough places left on this slot (" + remaining + " remaining)");
            }

            reservation.setStatus(ERStatus.ACCEPTED);
            reservationRepository.save(reservation);

            // Auto-reject pendings that no longer fit in the remaining seats (FIFO order)
            int remainingAfter = remaining - reservation.getNumberOfPlayers();
            List<Reservation> pendings = reservationRepository
                    .findByTimeSlot_IdAndStatusOrderByCreatedAtAsc(timeSlot.getId(), ERStatus.PENDING);
            int autoRejected = 0;
            for (Reservation pending : pendings) {
                if (pending.getNumberOfPlayers() > remainingAfter) {
                    pending.setStatus(ERStatus.REJECTED);
                    autoRejected++;
                }
            }
            reservationRepository.saveAll(pendings);
            return autoRejected;
        }

        throw new BusinessException("Unsupported status: " + request.status());
    }

    /**
     * Paginated reservations for the clubs owned by the authenticated manager,
     * with optional filters (player name, status, course, date). Predicates are
     * built dynamically via JPA Specifications — no nullable bind parameters,
     * which PostgreSQL cannot type-infer.
     */
    public Page<ManagerReservationResponse> getClubReservationsForManager(
            String name, ERStatus status, UUID courseId,
            LocalDate date, int page, int size) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser"))
            throw new IllegalArgumentException("Not authenticated");

        User manager = userRepository.findUserByUsername(auth.getName());
        if (!manager.getRole().getName().equals("ROLE_MANAGER"))
            throw new BusinessException("Only managers can view club reservations");

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        final String searchLower = (name == null || name.isBlank()) ? null : "%" + name.toLowerCase() + "%";
        final LocalDateTime startOfDay = date == null ? null : date.atStartOfDay();
        final LocalDateTime endOfDay   = date == null ? null : date.plusDays(1).atStartOfDay();

        Specification<Reservation> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only reservations on courses of clubs owned by this manager
            predicates.add(cb.equal(
                    root.get("timeSlot").get("course").get("club").get("owner").get("id"),
                    manager.getId()));

            if (searchLower != null) {
                Expression<String> fullName = cb.concat(
                        root.get("player").get("firstName"), " ");
                fullName = cb.concat(fullName, root.get("player").get("lastName"));
                predicates.add(cb.like(cb.lower(fullName), searchLower));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (courseId != null) {
                predicates.add(cb.equal(root.get("timeSlot").get("course").get("id"), courseId));
            }
            if (startOfDay != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timeSlot").get("startTime"), startOfDay));
            }
            if (endOfDay != null) {
                predicates.add(cb.lessThan(root.get("timeSlot").get("startTime"), endOfDay));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return reservationRepository.findAll(spec, pageable)
                .map(this::toManagerResponse);
    }

    private ManagerReservationResponse toManagerResponse(Reservation r) {
        return new ManagerReservationResponse(
                r.getId(),
                r.getStatus().name(),
                r.getPlayer().getFirstName() + " " + r.getPlayer().getLastName(),
                r.getPlayer().getPhoneNumber() == null ? "" : r.getPlayer().getPhoneNumber(),
                r.getTimeSlot().getCourse().getId(),
                r.getTimeSlot().getCourse().getName(),
                r.getTimeSlot().getStartTime(),
                r.getNumberOfPlayers(),
                r.getTimeSlot().getCourse().getGreenFee(),
                r.getCreatedAt());
    }
}
