package com.golf.golf_project.tournaments.controllers;

import com.golf.golf_project.exeptions.dto.ApiResponse;
import com.golf.golf_project.tournaments.dto.requests.CreateTournamentRequest;
import com.golf.golf_project.tournaments.dto.requests.SearchTournamentRequest;
import com.golf.golf_project.tournaments.dto.requests.UpdateTournamentRequest;
import com.golf.golf_project.tournaments.services.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/tournaments")
@RequiredArgsConstructor
public class TournamentController {
    private final TournamentService tournamentService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody SearchTournamentRequest req) {
        return ResponseEntity.ok(ApiResponse.success(tournamentService.search(req)));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<?> createMultipart(
            @RequestPart("data") CreateTournamentRequest req,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image
    ) {
        return ResponseEntity.ok(ApiResponse.success(tournamentService.create(req, image)));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping
    public ResponseEntity<?> updateMultipart(
            @RequestPart("data") UpdateTournamentRequest req,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image
    ) {
        return ResponseEntity.ok(ApiResponse.success(tournamentService.update(req, image)));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateJson(@PathVariable java.util.UUID id, @RequestBody UpdateTournamentRequest req) {
        req = new UpdateTournamentRequest(id, req.name(), req.description(), req.date(), req.location(), req.entryFee(), req.maxParticipants(), req.imageUrl(), req.status(), req.clubId());
        return ResponseEntity.ok(ApiResponse.success(tournamentService.update(req, null)));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        tournamentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }
}
