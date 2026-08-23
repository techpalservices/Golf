package com.golf.golf_project.timeSlots.mappers;

import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.enums.ETStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
}
