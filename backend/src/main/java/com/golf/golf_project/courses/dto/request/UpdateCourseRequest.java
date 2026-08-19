package com.golf.golf_project.courses.dto.request;

import com.golf.golf_project.courses.enums.ECStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public record UpdateCourseRequest(
        UUID id,
        String name,
        Integer holeCount,
        Number greenFee,
        String description,
        ECStatus status,
        List<MultipartFile> images,
        List<String> deletedImages
) {
}
