package com.golf.golf_project.courses.services;

import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.dto.request.CreateCourseRequest;
import com.golf.golf_project.courses.dto.request.UpdateCourseRequest;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.enums.ECStatus;
import com.golf.golf_project.courses.mappers.CourseMapper;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.shared.services.UploadService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
        // CourseService.java — replace line 43 with:
        course.setImagesUrls(
                request.imagesUrls() == null
                        ? List.of()
                        : request.imagesUrls().stream().map(uploadService::uploadFile).toList()
        );

        // Save the course entity to the database (you would typically use a repository here)
        courseRepository.save(course);
    }

    @Transactional
    public void updateCourse(UpdateCourseRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Course course = courseRepository.findCourseById(request.id());
        if (course == null) {
            throw new IllegalArgumentException("Course not found");
        }

        if (!course.getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        // PATCH semantics: only touch fields that are present
        if (request.name() != null) course.setName(request.name());
        if (request.holeCount() != null) course.setHoleCount(request.holeCount());
        if (request.greenFee() != null) course.setGreenFee(request.greenFee());
        if (request.description() != null) course.setDescription(request.description());

        // Images: keep existing → minus removed → plus new
        List<String> currentImages = new ArrayList<>(
                course.getImagesUrls() == null ? List.of() : course.getImagesUrls()
        );

        if (request.deletedImages() != null && !request.deletedImages().isEmpty()) {
            currentImages.removeAll(request.deletedImages());
        }

        if (request.images() != null && !request.images().isEmpty()) {
            currentImages.addAll(
                    request.images().stream().map(uploadService::uploadFile).toList()
            );
        }

        course.setImagesUrls(currentImages);

        courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Course course = courseRepository.findCourseById(id);
        if (course == null) {
            throw new IllegalArgumentException("Course not found");
        }

        if (!course.getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        courseRepository.delete(course);
    }
}
