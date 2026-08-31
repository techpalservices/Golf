package com.golf.golf_project.dashboard.repositories;

import com.golf.golf_project.users.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
public interface DashboardRepository extends Repository<User, java.util.UUID> {

    interface RoleCountRow {
        String getRole();

        long getTotal();
    }

    interface MonthGrowthRow {
        String getMonth();

        long getPlayers();

        long getManagers();

        long getInfluencers();
    }

    interface DailyCountRow {
        String getDate();

        long getCount();
    }

    interface ClubCountRow {
        String getName();

        long getCount();
    }

    interface StatusCountRow {
        com.golf.golf_project.reservations.enums.ERStatus getStatus();

        long getCount();
    }

    @Query(value = """
            SELECT ro.name AS role, COUNT(u.user_id) AS total
            FROM users u
            JOIN roles ro ON u.role_id = ro.role_id
            WHERE u.deleted_at IS NULL
            GROUP BY ro.name
            """, nativeQuery = true)
    List<RoleCountRow> countUsersByRole();

    @Query(value = """
            SELECT to_char(date_trunc('month', u.created_at), 'YYYY-MM') AS month,
                   SUM(CASE WHEN ro.name = 'ROLE_PLAYER' THEN 1 ELSE 0 END) AS players,
                   SUM(CASE WHEN ro.name = 'ROLE_MANAGER' THEN 1 ELSE 0 END) AS managers,
                   SUM(CASE WHEN ro.name = 'ROLE_INFLUENCER' THEN 1 ELSE 0 END) AS influencers
            FROM users u
            JOIN roles ro ON u.role_id = ro.role_id
            WHERE u.deleted_at IS NULL AND u.created_at >= :start
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<MonthGrowthRow> countUsersByMonth(@Param("start") LocalDateTime start);

    /** Daily count of newly created reservations between start (inclusive) and end (exclusive). */
    @Query(value = """
            SELECT to_char(date_trunc('day', r.created_at), 'YYYY-MM-DD') AS date,
                   COUNT(r.reservation_id) AS count
            FROM reservations r
            WHERE r.deleted_at IS NULL AND r.created_at >= :start AND r.created_at < :end
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<DailyCountRow> countReservationsByDay(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    /** Daily count of reservations by actual tee-time (time slot start) — powers the yearly heatmap. */
    @Query(value = """
            SELECT to_char(date_trunc('day', ts.start_time), 'YYYY-MM-DD') AS date,
                   COUNT(r.reservation_id) AS count
            FROM reservations r
            JOIN time_slots ts ON r.time_slot_id = ts.time_slot_id
            WHERE r.deleted_at IS NULL AND ts.start_time >= :start AND ts.start_time < :end
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<DailyCountRow> countPlayActivityByDay(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = """
            SELECT c.name AS name, COUNT(r.reservation_id) AS count
            FROM reservations r
            JOIN time_slots ts ON r.time_slot_id = ts.time_slot_id
            JOIN courses co ON ts.course_id = co.course_id
            JOIN clubs c ON co.club_id = c.club_id
            WHERE r.deleted_at IS NULL
            GROUP BY c.club_id, c.name
            ORDER BY count DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<ClubCountRow> topClubsByReservations(@Param("limit") int limit);

    /**
     * Green-fee revenue rows (players × course fee) of ACCEPTED reservations
     * created in the window. Returned as raw rows instead of SUM-ing in SQL
     * because Course.greenFee is mapped as `Number` (interface), which
     * Hibernate stores as serialized bytea — it cannot be multiplied in SQL.
     * The sum is computed in AdminDashboardService.
     */
    @Query("""
            SELECT r.numberOfPlayers, co.greenFee
            FROM Reservation r
            JOIN r.timeSlot ts
            JOIN ts.course co
            WHERE r.createdAt >= :start AND r.createdAt < :end
              AND r.status = com.golf.golf_project.reservations.enums.ERStatus.ACCEPTED
            """)
    List<Object[]> findAcceptedReservationRevenueRows(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT r.status AS status, COUNT(r) AS count FROM Reservation r GROUP BY r.status")
    List<StatusCountRow> countReservationsByStatus();

    @Query("SELECT COUNT(c) FROM Club c")
    long countTotalClubs();

    @Query("SELECT COUNT(c) FROM Club c WHERE c.status = com.golf.golf_project.clubs.enums.ECStatus.ACTIVE")
    long countActiveClubs();

    @Query("SELECT COUNT(t) FROM Tournament t WHERE t.status = com.golf.golf_project.tournaments.enums.ETStatus.ACTIVE")
    long countActiveTournaments();

    @Query("SELECT COUNT(mr) FROM MembershipRequest mr " +
            "WHERE mr.status = com.golf.golf_project.memberships.enums.EMRStatus.PENDING")
    long countPendingMembershipRequests();
}