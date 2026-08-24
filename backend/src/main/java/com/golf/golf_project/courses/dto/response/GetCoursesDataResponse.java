package com.golf.golf_project.courses.dto.response;

import com.golf.golf_project.timeSlots.dto.responses.GetTimeSlotsDataResponse;

import java.util.List;
import java.util.UUID;

public record GetCoursesDataResponse(
        UUID id,
        String name,
        int holeCount,
        Number greenFee,
        String description,
        List<String> imagesUrl,
        List<GetTimeSlotsDataResponse> timeSlots
) {
}
