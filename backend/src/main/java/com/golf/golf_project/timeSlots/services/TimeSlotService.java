package com.golf.golf_project.timeSlots.services;

import com.golf.golf_project.clubs.dto.response.GetClubDataResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.dto.response.GetCoursesDataResponse;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.enums.ECStatus;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import com.golf.golf_project.reservations.repositories.ReservationRepository;
import com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest;
import com.golf.golf_project.timeSlots.dto.requests.SearchManagerTimeSlotsRequest;
import com.golf.golf_project.timeSlots.dto.requests.SearchTimeSlotsRequest;
import com.golf.golf_project.timeSlots.dto.requests.UpdateTimeSlotStatusRequest;
import com.golf.golf_project.timeSlots.dto.responses.GetTimeSlotsDataResponse;
import com.golf.golf_project.timeSlots.dto.responses.ManagerTimeSlotResponse;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.enums.ETStatus;
import com.golf.golf_project.timeSlots.mappers.TimeSlotMapper;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class TimeSlotService {

    private final CourseRepository courseRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;
    private final ClubRepository clubRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public void createTimeSlot(CreateTimeSlotRequest request) {
        if (!courseRepository.existsById(request.courseId())) {
            throw new IllegalArgumentException("Invalid course ID");
        }
        Course course = courseRepository.findCourseById(request.courseId());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        if (!course.getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        ETStatus status = request.status() != null ? request.status() : ETStatus.CLOSED;
        LocalDateTime start = request.startTime();
        LocalDateTime end = request.endTime() != null && request.endTime().isAfter(start)
                ? request.endTime()
                : start.plusMinutes(5);

        // Ensure we always generate 5-minute CLOSED slots for the whole range
        // even if slots already exist. We never shrink existing slots' end times.
        LocalDateTime curr = start;
        while (curr.isBefore(end)) {
            LocalDateTime next = curr.plusMinutes(5);
            if (next.isAfter(end)) {
                next = end;
            }

            Optional<TimeSlot> existing = timeSlotRepository.findByCourseAndStartTime(course, curr);
            if (existing.isPresent()) {
                TimeSlot s = existing.get();
                // Only update status, keep original endTime to avoid corrupting longer slots
                s.setStatus(status);
                timeSlotRepository.save(s);
            } else {
                TimeSlot s = new TimeSlot();
                s.setCourse(course);
                s.setStartTime(curr);
                // Create proper 5-minute slots; final slot may be shorter if range ends mid-interval
                s.setEndTime(next);
                s.setStatus(status);
                timeSlotRepository.save(s);
            }
            curr = next;
        }
    }

    public void updateTimeSlotStatus(UpdateTimeSlotStatusRequest request) {
        TimeSlot timeSlot = timeSlotRepository.findById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Time slot not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        if (!timeSlot.getCourse().getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        timeSlot.setStatus(request.status());
        timeSlotRepository.save(timeSlot);
    }

    /**
     * Manager daily planning: returns only "relevant" slots — CLOSED or RESERVED
     * ones, or slots holding ACCEPTED reservations (pending ones are not
     * confirmed yet and stay out of the planning). Filters are dynamic
     * database-side predicates via Specifications.
     */
    @Transactional(readOnly = true)
    public Page<ManagerTimeSlotResponse> getManagerPlanning(SearchManagerTimeSlotsRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        User manager = userRepository.findUserByUsername(auth.getName());
        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new IllegalArgumentException("User must be manager");
        }

        final LocalDateTime from = request.dateFrom() == null ? null : request.dateFrom().atStartOfDay();
        final LocalDateTime to = request.dateTo() == null ? null : request.dateTo().plusDays(1).atStartOfDay();
        final UUID courseId = request.courseId();
        final String search = request.q() == null || request.q().isBlank() ? null : "%" + request.q().trim().toLowerCase() + "%";

        Specification<TimeSlot> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only slots of courses belonging to clubs owned by this manager
            predicates.add(cb.equal(
                    root.get("course").get("club").get("owner").get("id"),
                    manager.getId()));

            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startTime"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThan(root.get("startTime"), to));
            }
            if (courseId != null) {
                predicates.add(cb.equal(root.get("course").get("id"), courseId));
            }

            // Relevant-slot rule: closed/reserved OR has matching ACCEPTED reservations.
            Subquery<Integer> sub = query.subquery(Integer.class);
            Root<Reservation> r = sub.from(Reservation.class);
            List<Predicate> reservationPredicates = new ArrayList<>();
            reservationPredicates.add(cb.equal(r.get("timeSlot"), root));
            reservationPredicates.add(cb.in(r.get("status")).value(Arrays.asList(ERStatus.ACCEPTED, ERStatus.PENDING)));
            if (search != null) {
                Expression<String> fullName = cb.concat(r.get("player").get("firstName"), " ");
                fullName = cb.concat(fullName, r.get("player").get("lastName"));
                reservationPredicates.add(cb.like(cb.lower(fullName), search));
            }
            sub.select(cb.literal(1)).where(reservationPredicates.toArray(new Predicate[0]));

            predicates.add(cb.or(
                    root.get("status").in(Arrays.asList(ETStatus.CLOSED, ETStatus.RESERVED)),
                    cb.exists(sub)));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(Math.max(request.page(), 0), Math.max(request.size(), 1),
                Sort.by(Sort.Direction.ASC, "startTime"));

        Page<TimeSlot> page = timeSlotRepository.findAll(spec, pageable);
        // Filter out legacy long slots (>15 min) that were created before the 5-min granularity
        List<ManagerTimeSlotResponse> filtered = page.getContent().stream()
                .filter(ts -> {
                    long minutes = java.time.Duration.between(ts.getStartTime(), ts.getEndTime()).toMinutes();
                    return minutes > 0 && minutes <= 15;
                })
                .map(timeSlotMapper::toManagerPlanningResponse)
                .toList();
        return new org.springframework.data.domain.PageImpl<>(filtered, pageable, filtered.size());
    }


    public Page<GetClubDataResponse> searchTimeSlots(SearchTimeSlotsRequest request) {
        // future-date guard (tomorrow by default)
        LocalDate date = request.date() != null ? request.date() : LocalDate.now().plusDays(1);
        if (!date.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("You can only search for a future date");
        }

        Pageable pageable = PageRequest.of(
                Math.max(request.page(), 0),
                Math.max(request.size(), 1),
                Sort.by("name").ascending());

        Page<Club> clubs = clubRepository.searchActiveClubs(
                wrapLike(request.clubName()),
                wrapLike(request.city()),
                wrapLike(request.address()),
                pageable);

        if (clubs.isEmpty()) return Page.empty(pageable);

        List<UUID> clubIds = clubs.getContent().stream().map(Club::getId).toList();
        List<Course> courses = courseRepository.findAllByClubIdInAndStatus(clubIds, ECStatus.ACTIVE);

        List<UUID> courseIds = courses.stream().map(Course::getId).toList();
        List<Object[]> rows = courseIds.isEmpty()
                ? List.of()
                : timeSlotRepository.findBookedPlayersByCourseIds(
                courseIds, date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        // Build → slots by course
        Map<UUID, List<GetTimeSlotsDataResponse>> slotsByCourse = new HashMap<>();
        for (Object[] row : rows) {
            UUID courseId = (UUID) row[0];
            GetTimeSlotsDataResponse slot = new GetTimeSlotsDataResponse(
                    (UUID) row[1],
                    (LocalDateTime) row[2],
                    (LocalDateTime) row[3],
                    ((Number) row[4]).intValue(),
                    (ETStatus) row[5]);
            slotsByCourse.computeIfAbsent(courseId, k -> new ArrayList<>()).add(slot);
        }

        // Clubs where the current player already has a reservation on this date
        Set<UUID> blockedClubIds = getBlockedClubIdsForPlayer(clubIds, date);

        Map<UUID, List<GetCoursesDataResponse>> coursesByClub = new HashMap<>();
        for (Course c : courses) {
            GetCoursesDataResponse dto = new GetCoursesDataResponse(
                    c.getId(), c.getName(), c.getHoleCount(), c.getGreenFee(), c.getDescription(),
                    c.getImagesUrls() == null ? List.of() : c.getImagesUrls(),
                    slotsByCourse.getOrDefault(c.getId(), List.of()));
            coursesByClub.computeIfAbsent(c.getClub().getId(), k -> new ArrayList<>()).add(dto);
        }

        List<GetClubDataResponse> content = clubs.getContent().stream()
                .map(club -> new GetClubDataResponse(
                        club.getId(), club.getName(), club.getCity(), club.getAddress(),
                        club.getDescription(), club.getLogoURL(), club.getCoverURL(),
                        club.getOpenTime(), club.getCloseTime(),
                        blockedClubIds.contains(club.getId()),
                        coursesByClub.getOrDefault(club.getId(), List.of())))
                .toList();

        return new PageImpl<>(content, pageable, clubs.getTotalElements());
    }

    private Set<UUID> getBlockedClubIdsForPlayer(List<UUID> clubIds, LocalDate date) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
                return Set.of();
            }
            var player = userRepository.findUserByUsername(auth.getName());
            if (player == null) return Set.of();

            Set<UUID> blocked = new HashSet<>();
            for (UUID clubId : clubIds) {
                if (reservationRepository.existsByPlayerAndClubOnDate(
                        player.getId(), clubId,
                        date.atStartOfDay(), date.plusDays(1).atStartOfDay(),
                        List.of(ERStatus.PENDING, ERStatus.ACCEPTED))) {
                    blocked.add(clubId);
                }
            }
            return blocked;
        } catch (Exception e) {
            return Set.of(); // not logged in → nothing blocked
        }
    }

    private String wrapLike(String value) {
        return (value == null || value.isBlank()) ? null : "%" + value.trim().toLowerCase() + "%";
    }
}