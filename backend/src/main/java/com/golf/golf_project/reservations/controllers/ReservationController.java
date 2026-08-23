package com.golf.golf_project.reservations.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.reservations.dto.requests.CreateReservationRequest;
import com.golf.golf_project.reservations.services.ReservationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
