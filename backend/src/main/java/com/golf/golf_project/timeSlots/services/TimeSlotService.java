package com.golf.golf_project.timeSlots.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.enums.ECStatus;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import com.golf.golf_project.tournaments.enums.ETStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TimeSlotService {

    private final CourseRepository courseRepository;
    private final TimeSlotRepository timeSlotRepository;

    // Called at 12:00 and also manually
    public void generateNext7Days() {
        List<Course> courses = courseRepository.findAllByStatus(ECStatus.ACTIVE);
        for (Course course : courses) {
            for (int day = 1; day <= 7; day++) {
                LocalDate date = LocalDate.now().plusDays(day);
                generateForCourseAndDate(course, date);
            }
        }
    }

    private void generateForCourseAndDate(Course course, LocalDate date) {
        Club club = course.getClub();
        // Fallback to 07:00-19:00 if club has no hours yet (for your existing clubs in DB)
        LocalTime open = club.getOpenTime() != null ? club.getOpenTime() : LocalTime.of(7,0);
        LocalTime close = club.getCloseTime() != null ? club.getCloseTime() : LocalTime.of(19,0);

        for (LocalTime t = open; t.isBefore(close); t = t.plusMinutes(5)) {
            LocalDateTime start = date.atTime(t);
            LocalDateTime end = start.plusMinutes(5);

            // Idempotent - skip if already exists
            if (timeSlotRepository.existsByCourseAndStartTime(course, start)) continue;

            TimeSlot slot = new TimeSlot();
            slot.setCourse(course);
            slot.setStartTime(start);
            slot.setEndTime(end);
            slot.setStatus(ETStatus.ACTIVE);
            timeSlotRepository.save(slot);
        }
    }

    @Scheduled(cron = "0 0 12 * * *") // every day at 12:00
    public void scheduledGeneration() {
        generateNext7Days();
    }
}
