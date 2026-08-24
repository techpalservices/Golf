package com.golf.golf_project.reservations.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.exeptions.entities.ResourceNotFoundException;
import com.golf.golf_project.reservations.dto.requests.CreateReservationRequest;
import com.golf.golf_project.reservations.dto.requests.UpdateReservationStatusRequest;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import com.golf.golf_project.reservations.repositories.ReservationRepository;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.enums.ETStatus;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ReservationService {

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

        // Capacity check (your numberOfPlayers idea)
        int totalPlayers = timeSlot.getReservations() == null ? 0
                : timeSlot.getReservations().stream().mapToInt(Reservation::getNumberOfPlayers).sum();
        if (totalPlayers + request.numberOfPlayers() > 4) // max players for a time slot is 4
            throw new BusinessException("The number of players exceeds the maximum allowed for this time slot");

        Reservation reservation = new Reservation();
        reservation.setTimeSlot(timeSlot);
        reservation.setStatus(ERStatus.PENDING);
        reservation.setNumberOfPlayers(request.numberOfPlayers());
        reservation.setPlayer(player);
        reservationRepository.save(reservation);
    }

    public void updateReservationStatus(UpdateReservationStatusRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser"))
            throw new IllegalArgumentException("Not authenticated");

        User player = userRepository.findUserByUsername(auth.getName());
        if (!player.getRole().getName().equals("ROLE_MANAGER"))
            throw new BusinessException("Only managers can update reservation status");

        Reservation reservation = reservationRepository.findById(request.id())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        Club club = reservation.getTimeSlot().getCourse().getClub();

        if (!club.getOwner().getId().equals(player.getId()))
            throw new BusinessException("The requester must be the owner of the club");

        reservation.setStatus(request.status());
        reservationRepository.save(reservation);
    }
}
