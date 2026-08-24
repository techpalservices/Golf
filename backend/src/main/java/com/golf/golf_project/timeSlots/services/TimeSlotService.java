package com.golf.golf_project.timeSlots.services;

import com.golf.golf_project.clubs.dto.response.GetClubDataResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.dto.response.GetCoursesDataResponse;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.enums.ECStatus;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest;
import com.golf.golf_project.timeSlots.dto.requests.SearchTimeSlotsRequest;
import com.golf.golf_project.timeSlots.dto.requests.UpdateTimeSlotStatusRequest;
import com.golf.golf_project.timeSlots.dto.responses.GetTimeSlotsDataResponse;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.mappers.TimeSlotMapper;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
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
                    ((Number) row[4]).intValue());
            slotsByCourse.computeIfAbsent(courseId, k -> new ArrayList<>()).add(slot);
        }

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
                        coursesByClub.getOrDefault(club.getId(), List.of())))
                .toList();

        return new PageImpl<>(content, pageable, clubs.getTotalElements());
    }

    private String wrapLike(String value) {
        return (value == null || value.isBlank()) ? null : "%" + value.trim().toLowerCase() + "%";
    }
}