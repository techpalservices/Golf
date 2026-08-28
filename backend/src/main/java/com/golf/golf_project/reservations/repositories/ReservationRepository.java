package com.golf.golf_project.reservations.repositories;

import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.reservations.enums.ERStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID>,
        JpaSpecificationExecutor<Reservation> {

    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
            "JOIN r.timeSlot ts " +
            "JOIN ts.course c " +
            "WHERE r.player.id = :playerId " +
            "AND c.club.id = :clubId " +
            "AND ts.startTime >= :startOfDay AND ts.startTime < :endOfDay " +
            "AND r.status IN :statuses")
    boolean existsByPlayerAndClubOnDate(
            @Param("playerId") UUID playerId,
            @Param("clubId") UUID clubId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("statuses") List<ERStatus> statuses);

    // Manager reservations listing is built dynamically in ReservationService via
    // JpaSpecificationExecutor (Specification) — avoids nullable SQL parameters that
    // PostgreSQL cannot type-infer (SQLState 42P18 / 42883 errors).

    // FIFO: oldest pending requests first when competing for leftover seats
    List<Reservation> findByTimeSlot_IdAndStatusOrderByCreatedAtAsc(UUID timeSlotId, ERStatus status);

    @Query("SELECT r FROM Reservation r " +
            "JOIN FETCH r.timeSlot ts " +
            "JOIN FETCH ts.course c " +
            "JOIN FETCH c.club club " +
            "WHERE r.player.username = :playerUsername " +
            "AND (:search IS NULL OR LOWER(club.name) LIKE :search OR LOWER(c.name) LIKE :search) " +
            "AND (:status IS NULL OR r.status = :status)")
    org.springframework.data.domain.Page<Reservation> findPlayerReservations(
            String playerUsername,
            String search,
            ERStatus status,
            Pageable pageable
    );
}
