package com.golf.golf_project.timeSlots.mappers;

import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest;
import com.golf.golf_project.timeSlots.dto.responses.ManagerTimeSlotResponse;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.enums.ETStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Transactional
@AllArgsConstructor
public class TimeSlotMapper {

    private final CourseRepository courseRepository;

    public TimeSlot toTimeSlot(CreateTimeSlotRequest request) {
        if (!courseRepository.existsById(request.courseId())) {
            throw new IllegalArgumentException("Invalid course ID");
        }

        TimeSlot newTimeSlot = new TimeSlot();
        newTimeSlot.setCourse(courseRepository.findCourseById(request.courseId()));
        newTimeSlot.setStartTime(request.startTime());
        newTimeSlot.setEndTime(request.endTime());

        if (request.status() == null) {
            newTimeSlot.setStatus(ETStatus.OPEN);
        } else {
            newTimeSlot.setStatus(request.status());
        }

        return newTimeSlot;
    }

    public ManagerTimeSlotResponse toManagerPlanningResponse(TimeSlot slot) {
        List<Reservation> relevant = slot.getReservations() == null ? List.of()
                : slot.getReservations().stream()
                .filter(r -> r.getStatus() == ERStatus.ACCEPTED || r.getStatus() == ERStatus.PENDING)
                .toList();

        int bookedPlayers = relevant.stream().mapToInt(Reservation::getNumberOfPlayers).sum();
        List<ManagerTimeSlotResponse.PlayerRow> players = relevant.stream()
                .map(r -> new ManagerTimeSlotResponse.PlayerRow(
                        r.getId(),
                        r.getPlayer().getFirstName() + " " + r.getPlayer().getLastName(),
                        r.getPlayer().getPhoneNumber() == null ? "" : r.getPlayer().getPhoneNumber(),
                        r.getNumberOfPlayers()))
                .toList();

        return new ManagerTimeSlotResponse(
                slot.getId(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getStatus() == null ? "" : slot.getStatus().name(),
                bookedPlayers,
                slot.getCourse().getId(),
                slot.getCourse().getName(),
                slot.getCourse().getGreenFee(),
                players);
    }
}
