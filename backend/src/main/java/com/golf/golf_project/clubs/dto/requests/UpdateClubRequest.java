package com.golf.golf_project.clubs.dto.requests;

import com.golf.golf_project.clubs.enums.ECStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record UpdateClubRequest(
        UUID id,
        String name,
        String address,
        String city,
        String phone,
        String email,
        String description,
        MultipartFile logoURL,
        MultipartFile coverURL
) {
}
