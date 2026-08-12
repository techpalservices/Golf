package com.golf.golf_project.courses.dto.response;

import com.golf.golf_project.courses.enums.ECStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CoursesDataResponse(
        UUID id,
        String name,
        int holeCount,
        Number greenFee,
        String description,
        ECStatus status,
        LocalDateTime createdAt,
        List<String> imagesUrls
) {
}
