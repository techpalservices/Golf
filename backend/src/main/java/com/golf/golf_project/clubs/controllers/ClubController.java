package com.golf.golf_project.clubs.controllers;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequest;
import com.golf.golf_project.clubs.dto.requests.UpdateClubRequest;
import com.golf.golf_project.clubs.services.ClubService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clubs")
@AllArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<?> createClub(
            @Valid @RequestBody CreateClubRequest request
    ){
        return ResponseEntity.ok(ApiResponse.success(clubService.createClub(request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllClubs() {
        return ResponseEntity.ok(ApiResponse.success(clubService.getAllClubs()));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/update")
    public ResponseEntity<?> firstModification(
            @Valid @RequestBody UpdateClubRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(clubService.updateClub(request)));
    }
}
