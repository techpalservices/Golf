package com.golf.golf_project.timeSlots.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.reservations.entities.Reservation;
import com.golf.golf_project.tournaments.enums.ETStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "time_slots")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class TimeSlot extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "time_slot_id")
    private UUID id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private ETStatus status;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "timeSlot", orphanRemoval = true)
    private List<Reservation> reservations;
}
