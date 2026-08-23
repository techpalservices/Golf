package com.golf.golf_project.reservations.repositories;

import com.golf.golf_project.reservations.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
}
