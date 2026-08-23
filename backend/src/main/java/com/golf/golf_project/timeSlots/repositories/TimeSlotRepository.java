package com.golf.golf_project.timeSlots.repositories;

import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {
    TimeSlot findTimeSlotById(UUID id);

    Optional<TimeSlot> findByCourseAndStartTime(Course course, LocalDateTime startTime);

    boolean existsByCourseAndStartTime(Course course, LocalDateTime startTime);
    List<TimeSlot> findByCourseAndStartTimeBetweenOrderByStartTime(Course course, LocalDateTime start, LocalDateTime end);
}
