package com.golf.golf_project.courses.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public record CreateCourseRequest(
        @NotBlank(message = "Course name is required")
        String name,

        @NotNull(message = "Hole count is required")
        int holeCount,

        @NotNull(message = "Green fee is required")
        Number greenFee,

        String description,
        List<MultipartFile> imagesUrls,

        @NotNull(message = "Club ID is required")
        UUID clubId
) {
}
