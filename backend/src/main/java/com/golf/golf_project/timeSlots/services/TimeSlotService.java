package com.golf.golf_project.timeSlots.services;

import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest;
import com.golf.golf_project.timeSlots.dto.requests.UpdateTimeSlotStatusRequest;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.mappers.TimeSlotMapper;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TimeSlotService {

    private final CourseRepository courseRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;

    public void createTimeSlot(CreateTimeSlotRequest request) {
        TimeSlot timeSlot = timeSlotMapper.toTimeSlot(request);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        if (!timeSlot.getCourse().getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        timeSlotRepository.save(timeSlot);
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
}
