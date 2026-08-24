package com.golf.golf_project.timeSlots.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest;
import com.golf.golf_project.timeSlots.dto.requests.SearchTimeSlotsRequest;
import com.golf.golf_project.timeSlots.dto.requests.UpdateTimeSlotStatusRequest;
import com.golf.golf_project.timeSlots.services.TimeSlotService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/time-slots")
@AllArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @PostMapping("/search")
    public ResponseEntity<?> search(
            @RequestBody SearchTimeSlotsRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(timeSlotService.searchTimeSlots(request))
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/add")
    public ResponseEntity<?> create(
            @Valid @RequestBody CreateTimeSlotRequest request
    ) {
        timeSlotService.createTimeSlot(request);
        return ResponseEntity.ok(
                ApiResponse.success("Time slot created successfully")
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/update-status")
    public ResponseEntity<?> updateStatus(
            @Valid @RequestBody UpdateTimeSlotStatusRequest request
    ) {
        timeSlotService.updateTimeSlotStatus(request);
        return ResponseEntity.ok(
                ApiResponse.success("Time slot status updated successfully")
        );
    }
}
