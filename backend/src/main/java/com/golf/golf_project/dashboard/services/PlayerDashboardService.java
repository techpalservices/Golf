package com.golf.golf_project.dashboard.services;

import com.golf.golf_project.dashboard.dto.responce.PlayerDashboardResponse;
import com.golf.golf_project.dashboard.dto.responce.PlayerDashboardResponse.Kpis;
import com.golf.golf_project.dashboard.dto.responce.PlayerDashboardResponse.NextReservation;
import com.golf.golf_project.dashboard.dto.responce.PlayerDashboardResponse.PlayerClub;
import com.golf.golf_project.dashboard.dto.responce.PlayerDashboardResponse.RecentReservation;
import com.golf.golf_project.dashboard.repositories.DashboardRepository;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@AllArgsConstructor
public class PlayerDashboardService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");
    private static final int RECENT_LIMIT = 5;
    private static final int CLUBS_LIMIT = 4;

    private final DashboardRepository dashboardRepository;

    @Transactional(readOnly = true)
    public PlayerDashboardResponse getPlayerDashboard() {
        String username = currentUsername();
        LocalDateTime now = LocalDateTime.now();
        List<ERStatus> upcomingStatuses = List.of(ERStatus.PENDING, ERStatus.ACCEPTED);

        // Next reservation = closest upcoming tee-time (PENDING or ACCEPTED), or null
        List<Reservation> upcoming = dashboardRepository.findUpcomingReservations(
                username, now, upcomingStatuses, PageRequest.of(0, 1));
        NextReservation next = upcoming.isEmpty() ? null : toNextReservation(upcoming.get(0));

        List<RecentReservation> recent = dashboardRepository
                .findPastReservations(username, now, PageRequest.of(0, RECENT_LIMIT))
                .stream()
                .map(this::toRecentReservation)
                .toList();

        List<PlayerClub> clubs = dashboardRepository
                .findPlayerMembershipClubs(username, PageRequest.of(0, CLUBS_LIMIT))
                .stream()
                .map(this::toPlayerClub)
                .toList();

        Kpis kpis = new Kpis(
                next == null ? null : next.time(),
                dashboardRepository.countReservationsByPlayerUsername(username),
                dashboardRepository.countPlayerMemberships(username),
                dashboardRepository.countUpcomingReservations(username, now, upcomingStatuses)
        );

        return new PlayerDashboardResponse(kpis, next, recent, clubs);
    }

    // === Mappers ===

    private NextReservation toNextReservation(Reservation r) {
        var tee = r.getTimeSlot().getStartTime();
        var course = r.getTimeSlot().getCourse();
        var club = course.getClub();
        List<String> images = course.getImagesUrls();
        String courseImage = (images == null || images.isEmpty()) ? null : images.get(0);
        return new NextReservation(
                r.getId(),
                club.getName(),
                club.getLogoURL(),
                course.getName(),
                courseImage,
                course.getHoleCount(),
                tee.format(DATE),
                tee.format(TIME),
                r.getNumberOfPlayers(),
                r.getStatus().name()
        );
    }

    private RecentReservation toRecentReservation(Reservation r) {
        var tee = r.getTimeSlot().getStartTime();
        return new RecentReservation(
                r.getId(),
                r.getTimeSlot().getCourse().getClub().getName(),
                tee.format(DATE),
                tee.format(TIME),
                r.getStatus().name()
        );
    }

    private PlayerClub toPlayerClub(Membership m) {
        var club = m.getClub();
        return new PlayerClub(
                club.getId(),
                club.getName(),
                club.getCity(),
                club.getLogoURL(),
                m.getTitle()
        );
    }

    // === Helpers ===

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new BusinessException("Not authenticated");
        }
        return auth.getName();
    }
}