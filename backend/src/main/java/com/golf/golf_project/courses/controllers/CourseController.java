package com.golf.golf_project.courses.controllers;

import com.golf.golf_project.courses.dto.request.CreateCourseRequest;
import com.golf.golf_project.courses.dto.request.UpdateCourseRequest;
import com.golf.golf_project.courses.services.CourseService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses")
@AllArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/add")
    public ResponseEntity<?> createCourse(
            @Valid @ModelAttribute CreateCourseRequest request
    ) {
        courseService.createCourse(request);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully"));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/update")
    public ResponseEntity<?> updateCourse(
            @Valid @ModelAttribute UpdateCourseRequest request
    ) {
        courseService.updateCourse(request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully"));
    }
}