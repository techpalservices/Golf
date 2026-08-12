package com.golf.golf_project.courses.controllers;

import com.golf.golf_project.courses.dto.request.CreateCourseRequest;
import com.golf.golf_project.courses.services.CourseService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses")
@AllArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/add")
    public ResponseEntity<?> createCourse(
            @Valid @RequestBody CreateCourseRequest request
    ) {
        courseService.createCourse(request);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully"));
    }

}
