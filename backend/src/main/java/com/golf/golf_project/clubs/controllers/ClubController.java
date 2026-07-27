package com.golf.golf_project.clubs.controllers;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequests;
import com.golf.golf_project.clubs.services.ClubService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clubs")
@AllArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<?> createClub(
            @Valid @RequestBody CreateClubRequests request
    ){
        return ResponseEntity.ok(ApiResponse.success(clubService.createClub(request)));
    }
}
