package com.golf.golf_project.timeSlots.repositories;

import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID>,
        JpaSpecificationExecutor<TimeSlot> {
    TimeSlot findTimeSlotById(UUID id);

    Optional<TimeSlot> findByCourseAndStartTime(Course course, LocalDateTime startTime);

    boolean existsByCourseAndStartTime(Course course, LocalDateTime startTime);
    List<TimeSlot> findByCourseAndStartTimeBetweenOrderByStartTime(Course course, LocalDateTime start, LocalDateTime end);

    @Query("SELECT ts.course.id, ts.id, ts.startTime, ts.endTime, " +
            "COALESCE(SUM(CASE WHEN r.status IN (ERStatus.ACCEPTED, ERStatus.PENDING) " +
            "THEN r.numberOfPlayers ELSE 0 END), 0), " +
            "ts.status " +
            "FROM TimeSlot ts LEFT JOIN ts.reservations r " +
            "WHERE ts.course.id IN :courseIds " +
            "AND ts.startTime >= :startOfDay AND ts.startTime < :endOfDay " +
            "GROUP BY ts.course.id, ts.id, ts.startTime, ts.endTime, ts.status " +
            "ORDER BY ts.startTime ASC")
    List<Object[]> findBookedPlayersByCourseIds(
            List<UUID> courseIds, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
