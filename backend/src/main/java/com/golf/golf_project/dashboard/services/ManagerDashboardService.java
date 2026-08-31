package com.golf.golf_project.dashboard.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.dashboard.dto.responce.ManagerDashboardResponse;
import com.golf.golf_project.dashboard.dto.responce.ManagerDashboardResponse.DailyRatePoint;
import com.golf.golf_project.dashboard.dto.responce.ManagerDashboardResponse.DailyRevenuePoint;
import com.golf.golf_project.dashboard.dto.responce.ManagerDashboardResponse.Kpis;
import com.golf.golf_project.dashboard.dto.responce.ManagerDashboardResponse.StatusCountPoint;
import com.golf.golf_project.dashboard.repositories.DashboardRepository;
import com.golf.golf_project.exeptions.entities.BusinessException;
import com.golf.golf_project.reservations.enums.ERStatus;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class ManagerDashboardService {

    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final int TREND_DAYS = 30;

    private final DashboardRepository dashboardRepository;
    private final ClubRepository clubRepository;

    @Transactional(readOnly = true)
    public ManagerDashboardResponse getManagerDashboard() {
        Club club = currentManagerClub();
        LocalDate today = LocalDate.now();

        Kpis kpis = buildKpis(club, today);
        List<DailyRatePoint> utilization = buildUtilization(club, today);
        List<StatusCountPoint> byStatus = buildReservationsByStatus(club);
        List<DailyRevenuePoint> revenue = buildRevenueTrend(club, today);

        return new ManagerDashboardResponse(kpis, utilization, byStatus, revenue);
    }

    // === KPIs ===

    private Kpis buildKpis(Club club, LocalDate today) {
        LocalDateTime dayStart = today.atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1).atStartOfDay();

        List<Object[]> revenueRows = dashboardRepository.findAcceptedReservationRevenueRowsForClub(
                club.getId(), dayStart, tomorrow);
        double todayRevenue = revenueRows.stream()
                .mapToDouble(this::rowRevenue)
                .sum();

        return new Kpis(
                dashboardRepository.countReservationsForClubInWindow(club.getId(), dayStart, tomorrow),
                pendingCount(club),
                dashboardRepository.countMembersForClub(club.getId()),
                todayRevenue
        );
    }

    private long pendingCount(Club club) {
        return dashboardRepository.countReservationsByStatusForClub(club.getId()).stream()
                .filter(row -> row.getStatus() == ERStatus.PENDING)
                .mapToLong(DashboardRepository.StatusCountRow::getCount)
                .sum();
    }

    // === Charts ===

    /**
     * Daily utilization % = reservations with a tee-time that day ÷ bookable
     * time slots that day (clamped to 0–100, 0 when the club has no slots).
     */
    private List<DailyRatePoint> buildUtilization(Club club, LocalDate today) {
        LocalDateTime start = today.minusDays(TREND_DAYS - 1).atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        Map<String, Long> slots = toDailyMap(
                dashboardRepository.countTimeSlotsByDayForClub(club.getId(), start, end));
        Map<String, Long> reservations = toDailyMap(
                dashboardRepository.countReservationsByDayForClub(club.getId(), start, end));

        List<DailyRatePoint> series = new ArrayList<>();
        for (LocalDate d = today.minusDays(TREND_DAYS - 1); !d.isAfter(today); d = d.plusDays(1)) {
            String key = d.format(DAY);
            long slotCount = slots.getOrDefault(key, 0L);
            long reservationCount = reservations.getOrDefault(key, 0L);
            double rate = slotCount == 0
                    ? 0.0
                    : Math.min(100.0, Math.round(reservationCount * 1000.0 / slotCount) / 10.0);
            series.add(new DailyRatePoint(key, rate));
        }
        return series;
    }

    /** Status distribution ordered PENDING → ACCEPTED → REJECTED (zeros included). */
    private List<StatusCountPoint> buildReservationsByStatus(Club club) {
        Map<ERStatus, Long> byStatus = new HashMap<>();
        dashboardRepository.countReservationsByStatusForClub(club.getId())
                .forEach(row -> byStatus.put(row.getStatus(), row.getCount()));

        List<StatusCountPoint> series = new ArrayList<>();
        for (ERStatus status : ERStatus.values()) {
            series.add(new StatusCountPoint(status.name(), byStatus.getOrDefault(status, 0L)));
        }
        return series;
    }

    /** Daily green-fee revenue of ACCEPTED reservations by tee-time day (gaps filled with 0). */
    private List<DailyRevenuePoint> buildRevenueTrend(Club club, LocalDate today) {
        List<Object[]> rows = dashboardRepository.findAcceptedReservationRevenueRowsForClub(
                club.getId(),
                today.minusDays(TREND_DAYS - 1).atStartOfDay(),
                today.plusDays(1).atStartOfDay());

        Map<String, Double> byDay = new HashMap<>();
        for (Object[] row : rows) {
            LocalDateTime teeTime = (LocalDateTime) row[0];
            String key = teeTime.toLocalDate().format(DAY);
            byDay.merge(key, rowRevenue(row), Double::sum);
        }

        List<DailyRevenuePoint> series = new ArrayList<>();
        for (LocalDate d = today.minusDays(TREND_DAYS - 1); !d.isAfter(today); d = d.plusDays(1)) {
            series.add(new DailyRevenuePoint(d.format(DAY), byDay.getOrDefault(d.format(DAY), 0.0)));
        }
        return series;
    }

    // === Helpers ===

    private Club currentManagerClub() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new BusinessException("Not authenticated");
        }
        Club club = clubRepository.findClubByOwnerUsername(auth.getName());
        if (club == null) {
            throw new BusinessException("No club is associated with this manager");
        }
        return club;
    }

    private double rowRevenue(Object[] row) {
        int players = ((Number) row[1]).intValue();
        Number fee = (Number) row[2];
        return fee == null ? 0.0 : players * fee.doubleValue();
    }

    private Map<String, Long> toDailyMap(List<DashboardRepository.DailyCountRow> rows) {
        Map<String, Long> map = new HashMap<>();
        rows.forEach(row -> map.put(row.getDate(), row.getCount()));
        return map;
    }
}