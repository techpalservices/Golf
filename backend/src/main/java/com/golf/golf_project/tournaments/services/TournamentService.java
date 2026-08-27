package com.golf.golf_project.tournaments.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.courses.repositories.CourseRepository;
import com.golf.golf_project.timeSlots.entities.TimeSlot;
import com.golf.golf_project.timeSlots.repositories.TimeSlotRepository;
import com.golf.golf_project.tournaments.dto.requests.CreateTournamentRequest;
import com.golf.golf_project.tournaments.dto.requests.SearchTournamentRequest;
import com.golf.golf_project.tournaments.dto.requests.UpdateTournamentRequest;
import com.golf.golf_project.tournaments.dto.responses.TournamentResponse;
import com.golf.golf_project.tournaments.entities.Tournament;
import com.golf.golf_project.tournaments.enums.ETStatus;
import com.golf.golf_project.tournaments.repositories.TournamentRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TournamentService {
    private final TournamentRepository tournamentRepository;
    private final ClubRepository clubRepository;
    private final CourseRepository courseRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final com.golf.golf_project.users.repositories.UserRepository userRepository;
    private final com.golf.golf_project.timeSlots.services.TimeSlotService timeSlotService;

    public TournamentResponse create(CreateTournamentRequest req, org.springframework.web.multipart.MultipartFile image) {
        Club club = null;
        if (req.clubId() != null) {
            club = clubRepository.findById(req.clubId()).orElseThrow(() -> new IllegalArgumentException("Club not found"));
        } else {
            // fallback to manager's own club
            try {
                org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                    var user = userRepository.findUserByUsername(auth.getName());
                    if (user != null && user.getClub() != null) {
                        club = user.getClub();
                    }
                }
            } catch (Exception ignored) {}
        }
        Tournament t = new Tournament();
        t.setName(req.name());
        t.setDescription(req.description());
        t.setDate(req.date());
        t.setLocation(req.location());
        t.setEntryFee(req.entryFee() != null ? req.entryFee() : 0);
        t.setMaxParticipants(req.maxParticipants() != null ? req.maxParticipants() : 0);
        t.setCurrentParticipants(0);
        t.setImageUrl(handleImageUpload(image, req.imageUrl()));
        t.setStatus(req.status() != null ? req.status() : ETStatus.PENDING);
        t.setClub(club);
        tournamentRepository.save(t);
        // Reserve club for tournament day
        if (club != null && t.getDate() != null) {
            reserveClubForTournament(club, t.getDate());
        }
        return toResponse(t);
    }

    public TournamentResponse update(UpdateTournamentRequest req, org.springframework.web.multipart.MultipartFile image) {
        Tournament t = tournamentRepository.findById(req.id()).orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        if (req.name() != null) t.setName(req.name());
        if (req.description() != null) t.setDescription(req.description());
        if (req.date() != null) t.setDate(req.date());
        if (req.location() != null) t.setLocation(req.location());
        if (req.entryFee() != null) t.setEntryFee(req.entryFee());
        if (req.maxParticipants() != null) t.setMaxParticipants(req.maxParticipants());
        if (req.status() != null) t.setStatus(req.status());
        if (req.clubId() != null) {
            Club club = clubRepository.findById(req.clubId()).orElseThrow(() -> new IllegalArgumentException("Club not found"));
            t.setClub(club);
        } else if (req.clubId() == null && t.getClub() != null) {
            // keep existing or set null? keep existing
        }
        String imageUrl = handleImageUpload(image, req.imageUrl() != null ? req.imageUrl() : t.getImageUrl());
        t.setImageUrl(imageUrl);
        tournamentRepository.save(t);
        return toResponse(t);
    }

    public void delete(UUID id) {
        tournamentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<TournamentResponse> search(SearchTournamentRequest req) {
        Specification<Tournament> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            if (req.q() != null && !req.q().isBlank()) {
                String q = "%" + req.q().toLowerCase() + "%";
                preds.add(cb.or(
                        cb.like(cb.lower(root.get("name")), q),
                        cb.like(cb.lower(root.get("location")), q),
                        cb.like(cb.lower(root.get("club").get("name")), q)
                ));
            }
            if (req.status() != null && !req.status().isBlank()) {
                try {
                    ETStatus st = ETStatus.valueOf(req.status().toUpperCase());
                    preds.add(cb.equal(root.get("status"), st));
                } catch (Exception ignored) {}
            }
            if (req.location() != null && !req.location().isBlank()) {
                preds.add(cb.like(cb.lower(root.get("location")), "%" + req.location().toLowerCase() + "%"));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
        int page = req.page() != null ? req.page() : 0;
        int size = req.size() != null && req.size() > 0 ? req.size() : 20;
        Page<Tournament> p = tournamentRepository.findAll(spec, PageRequest.of(page, size));
        return p.map(this::toResponse);
    }

    private String handleImageUpload(org.springframework.web.multipart.MultipartFile file, String fallback) {
        if (file != null && !file.isEmpty()) {
            try {
                String filename = java.util.UUID.randomUUID() + "_" + file.getOriginalFilename();
                java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads/tournaments");
                java.nio.file.Files.createDirectories(uploadDir);
                java.nio.file.Path target = uploadDir.resolve(filename);
                java.nio.file.Files.copy(file.getInputStream(), target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                return "/uploads/tournaments/" + filename;
            } catch (Exception e) {
                // fallback to original
            }
        }
        return fallback;
    }

    private void reserveClubForTournament(Club club, LocalDate date) {
        List<Course> courses = courseRepository.findCoursesByClub(club);
        if (courses.isEmpty()) return;
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        for (Course course : courses) {
            try {
                com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest req = new com.golf.golf_project.timeSlots.dto.requests.CreateTimeSlotRequest(
                        start,
                        end,
                        com.golf.golf_project.timeSlots.enums.ETStatus.CLOSED,
                        course.getId()
                );
                timeSlotService.createTimeSlot(req);
            } catch (Exception e) {
                // ignore errors for this course
            }
        }
    }

    private TournamentResponse toResponse(Tournament t) {
        String clubName = t.getClub() != null ? t.getClub().getName() : "";
        return new TournamentResponse(
                t.getId(),
                t.getName(),
                t.getDescription(),
                t.getDate(),
                t.getLocation(),
                clubName,
                t.getStatus(),
                t.getImageUrl(),
                t.getEntryFee(),
                t.getMaxParticipants(),
                t.getCurrentParticipants()
        );
    }
}
