package com.golf.golf_project.reservations.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.reservations.dto.requests.CreateReservationRequest;
import com.golf.golf_project.reservations.dto.requests.SearchPlayerReservationsRequest;
import com.golf.golf_project.reservations.dto.requests.UpdateReservationStatusRequest;
import com.golf.golf_project.reservations.enums.ERStatus;
import com.golf.golf_project.reservations.services.ReservationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reservations")
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/add")
    public ResponseEntity<?> create(
            @Valid @RequestBody CreateReservationRequest request
    ) {
        reservationService.createReservation(request);
        return ResponseEntity.ok(
                ApiResponse.success("Reservation created successfully")
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/club")
    public ResponseEntity<?> clubReservations(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) ERStatus status,
            @RequestParam(required = false) UUID courseId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(reservationService.getClubReservationsForManager(
                        name, status, courseId, date, page, size))
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/update-status")
    public ResponseEntity<?> updateStatus(
            @Valid @RequestBody UpdateReservationStatusRequest request
    ) {
        int autoRejected = reservationService.updateReservationStatus(request);
        return ResponseEntity.ok(
                ApiResponse.success(Map.of("autoRejected", autoRejected))
        );
    }

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/player/list")
    public ResponseEntity<?> getPlayerReservations(
            @RequestBody SearchPlayerReservationsRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(reservationService.getPlayerReservations(request))
        );
    }
}
