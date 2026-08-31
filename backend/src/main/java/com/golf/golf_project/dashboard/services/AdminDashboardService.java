package com.golf.golf_project.dashboard.services;

import com.golf.golf_project.dashboard.dto.responce.AdminDashboardResponse;
import com.golf.golf_project.dashboard.dto.responce.AdminDashboardResponse.Kpis;
import com.golf.golf_project.dashboard.dto.responce.AdminDashboardResponse.MonthlyGrowthPoint;
import com.golf.golf_project.dashboard.dto.responce.AdminDashboardResponse.DailyCountPoint;
import com.golf.golf_project.dashboard.dto.responce.AdminDashboardResponse.ClubCountPoint;
import com.golf.golf_project.dashboard.repositories.DashboardRepository;
import com.golf.golf_project.reservations.enums.ERStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class AdminDashboardService {

    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final int TOP_CLUBS_LIMIT = 10;
    private static final int HEATMAP_DAYS = 365;

    private final DashboardRepository dashboardRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        LocalDate today = LocalDate.now();

        Kpis kpis = buildKpis(today);
        List<MonthlyGrowthPoint> usersGrowth = buildUsersGrowth(today);
        List<DailyCountPoint> reservationsTrend = buildReservationsTrend(today);
        List<DailyCountPoint> heatmap = buildHeatmap(today);
        List<ClubCountPoint> topClubs = dashboardRepository.topClubsByReservations(TOP_CLUBS_LIMIT).stream()
                .map(row -> new ClubCountPoint(row.getName(), row.getCount()))
                .toList();

        return new AdminDashboardResponse(kpis, usersGrowth, reservationsTrend, heatmap, topClubs);
    }

    // === KPIs ===

    private Kpis buildKpis(LocalDate today) {
        // Users by role
        Map<String, Long> byRole = new HashMap<>();
        dashboardRepository.countUsersByRole()
                .forEach(row -> byRole.put(row.getRole(), row.getTotal()));
        long totalUsers = byRole.values().stream().mapToLong(Long::longValue).sum();

        // Reservations: one query covering the previous 30-day window + the current one
        LocalDateTime trendStart = today.minusDays(59).atStartOfDay();
        LocalDateTime trendEnd = today.plusDays(1).atStartOfDay();
        Map<String, Long> byDay = toDailyMap(dashboardRepository.countReservationsByDay(trendStart, trendEnd));
        long reservationsLast30 = sumRange(byDay, today.minusDays(29), today);
        long reservationsPrev30 = sumRange(byDay, today.minusDays(59), today.minusDays(29));

        // Revenue: green fees of accepted reservations, current vs previous 30-day window
        double revenueLast30 = revenue(today.minusDays(29).atStartOfDay(), today.plusDays(1).atStartOfDay());
        double revenuePrev30 = revenue(today.minusDays(59).atStartOfDay(), today.minusDays(29).atStartOfDay());

        // Pending reservations
        long pendingReservations = dashboardRepository.countReservationsByStatus().stream()
                .filter(row -> row.getStatus() == ERStatus.PENDING)
                .mapToLong(DashboardRepository.StatusCountRow::getCount)
                .sum();

        return new Kpis(
                totalUsers,
                byRole.getOrDefault("ROLE_PLAYER", 0L),
                byRole.getOrDefault("ROLE_MANAGER", 0L),
                byRole.getOrDefault("ROLE_INFLUENCER", 0L),
                dashboardRepository.countTotalClubs(),
                dashboardRepository.countActiveClubs(),
                reservationsLast30,
                trendPct(reservationsPrev30, reservationsLast30),
                pendingReservations,
                dashboardRepository.countPendingMembershipRequests(),
                dashboardRepository.countActiveTournaments(),
                revenueLast30,
                trendPct(revenuePrev30, revenueLast30),
                newUsersThisMonth(today)
        );
    }

    private long newUsersThisMonth(LocalDate today) {
        LocalDateTime start = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();
        return dashboardRepository.countUsersByMonth(start).stream()
                .mapToLong(row -> row.getPlayers() + row.getManagers() + row.getInfluencers())
                .sum();
    }

    private double revenue(LocalDateTime start, LocalDateTime end) {
        // Sum computed in Java: green_fee is serialized bytea in the DB (Number
        // interface mapping) and cannot participate in SQL arithmetic.
        return dashboardRepository.findAcceptedReservationRevenueRows(start, end).stream()
                .mapToDouble(row -> {
                    int players = ((Number) row[0]).intValue();
                    Number fee = (Number) row[1];
                    return fee == null ? 0.0 : players * fee.doubleValue();
                })
                .sum();
    }

    // === Charts ===

    /** Cumulative users per role for each of the last 12 months. */
    private List<MonthlyGrowthPoint> buildUsersGrowth(LocalDate today) {
        LocalDateTime start = today.minusMonths(11).withDayOfMonth(1).atStartOfDay();
        Map<String, DashboardRepository.MonthGrowthRow> byMonth = new HashMap<>();
        dashboardRepository.countUsersByMonth(start)
                .forEach(row -> byMonth.put(row.getMonth(), row));

        List<MonthlyGrowthPoint> series = new ArrayList<>();
        long players = 0;
        long managers = 0;
        long influencers = 0;
        YearMonth cursor = YearMonth.from(today).minusMonths(11);
        YearMonth current = YearMonth.from(today);
        while (!cursor.isAfter(current)) {
            DashboardRepository.MonthGrowthRow row = byMonth.get(cursor.format(MONTH));
            if (row != null) {
                players += row.getPlayers();
                managers += row.getManagers();
                influencers += row.getInfluencers();
            }
            series.add(new MonthlyGrowthPoint(cursor.format(MONTH), players, managers, influencers));
            cursor = cursor.plusMonths(1);
        }
        return series;
    }

    /** Daily number of newly created reservations over the last 30 days (gaps filled with 0). */
    private List<DailyCountPoint> buildReservationsTrend(LocalDate today) {
        Map<String, Long> byDay = toDailyMap(dashboardRepository.countReservationsByDay(
                today.minusDays(29).atStartOfDay(), today.plusDays(1).atStartOfDay()));

        List<DailyCountPoint> series = new ArrayList<>();
        for (LocalDate d = today.minusDays(29); !d.isAfter(today); d = d.plusDays(1)) {
            series.add(new DailyCountPoint(d.format(DAY), byDay.getOrDefault(d.format(DAY), 0L)));
        }
        return series;
    }

    /** Daily tee-time activity over the last 365 days (gaps filled with 0) for the heatmap. */
    private List<DailyCountPoint> buildHeatmap(LocalDate today) {
        Map<String, Long> byDay = toDailyMap(dashboardRepository.countPlayActivityByDay(
                today.minusDays(HEATMAP_DAYS - 1).atStartOfDay(), today.plusDays(1).atStartOfDay()));

        List<DailyCountPoint> series = new ArrayList<>();
        for (LocalDate d = today.minusDays(HEATMAP_DAYS - 1); !d.isAfter(today); d = d.plusDays(1)) {
            series.add(new DailyCountPoint(d.format(DAY), byDay.getOrDefault(d.format(DAY), 0L)));
        }
        return series;
    }

    // === Helpers ===

    private Map<String, Long> toDailyMap(List<DashboardRepository.DailyCountRow> rows) {
        Map<String, Long> map = new HashMap<>();
        rows.forEach(row -> map.put(row.getDate(), row.getCount()));
        return map;
    }

    /** Sum of daily counts for [start, end) dates. */
    private long sumRange(Map<String, Long> byDay, LocalDate start, LocalDate end) {
        long sum = 0;
        for (LocalDate d = start; d.isBefore(end); d = d.plusDays(1)) {
            sum += byDay.getOrDefault(d.format(DAY), 0L);
        }
        return sum;
    }

    /** Percentage change from previous period to current period (100 when previous was 0). */
    private double trendPct(double previous, double current) {
        if (previous <= 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return Math.round(((current - previous) / previous) * 1000.0) / 10.0;
    }
}