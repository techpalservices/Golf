package com.golf.golf_project.courses.mappers;

import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.dto.request.CreateCourseRequest;
import com.golf.golf_project.courses.entities.Course;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
@AllArgsConstructor
public class CourseMapper {

    private final ClubRepository clubRepository;

    public Course toCourse(CreateCourseRequest request) {
        Course course = new Course();
        course.setName(request.name());
        course.setHoleCount(request.holeCount());
        course.setGreenFee(request.greenFee());
        course.setDescription(request.description());
        course.setImagesUrls(request.imagesUrls());
        course.setClub(clubRepository.findById(request.clubId()).orElse(null));
        return course;
    }
}
