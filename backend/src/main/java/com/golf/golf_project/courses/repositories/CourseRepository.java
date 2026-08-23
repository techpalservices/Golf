package com.golf.golf_project.courses.repositories;

import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.enums.ECStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    Course findCourseById(UUID id);

    List<Course> findAllByStatus(ECStatus status);
}
