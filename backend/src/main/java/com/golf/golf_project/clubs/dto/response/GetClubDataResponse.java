package com.golf.golf_project.clubs.dto.response;

import com.golf.golf_project.courses.dto.response.GetCoursesDataResponse;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record GetClubDataResponse (
    UUID id,
    String name,
    String city,
    String address,
    String description,
    String logoUrl,
    String coverUrl,
    LocalTime openTime,
    LocalTime closeTime,
    boolean blockedForPlayer,
    List<GetCoursesDataResponse> courses
){}
