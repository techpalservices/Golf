package com.golf.golf_project.courses.mappers;

import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.dto.request.CreateCourseRequest;
import com.golf.golf_project.courses.dto.request.UpdateCourseRequest;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.repositories.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
@AllArgsConstructor
public class CourseMapper {

    private final CourseRepository courseRepository;
    private final ClubRepository clubRepository;

    public Course toCourse(CreateCourseRequest request) {
        Course course = new Course();
        course.setName(request.name());
        course.setHoleCount(request.holeCount());
        course.setGreenFee(request.greenFee());
        course.setDescription(request.description());
        course.setClub(clubRepository.findById(request.clubId()).orElse(null));
        return course;
    }

    public Course toCourse(UpdateCourseRequest request) {
        Course course = courseRepository.findCourseById(request.id());
        course.setName(request.name());
        course.setHoleCount(request.holeCount() != null ? Integer.parseInt(request.holeCount()) : 0);
        course.setGreenFee(request.greenFee() != null ? Double.parseDouble(request.greenFee()) : 0.0);
        course.setDescription(request.description());
        course.setStatus(request.status());
        return course;
    }
}
