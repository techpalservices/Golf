package com.golf.golf_project.courses.services;

import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.dto.request.CreateCourseRequest;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.enums.ECStatus;
import com.golf.golf_project.courses.mappers.CourseMapper;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.shared.services.UploadService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CourseService {

    private final CourseMapper courseMapper;
    private final ClubRepository clubRepository;
    private final CourseRepository courseRepository;
    private final UploadService uploadService;

    public void createCourse(CreateCourseRequest request) {

        if (!clubRepository.existsById(request.clubId())) {
            throw new IllegalArgumentException("Invalid club ID");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Course course = courseMapper.toCourse(request);

        if (!course.getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        course.setStatus(ECStatus.ACTIVE);
        course.setImagesUrls(request.imagesUrls().stream().map(uploadService::uploadFile).toList());

        // Save the course entity to the database (you would typically use a repository here)
        courseRepository.save(course);
    }
}
