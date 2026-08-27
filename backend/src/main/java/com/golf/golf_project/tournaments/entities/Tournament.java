package com.golf.golf_project.tournaments.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.tournaments.enums.ETStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tournaments")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Tournament extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "tournament_id")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer entryFee;

    @Column(nullable = false)
    private Integer maxParticipants;

    @Column(nullable = false)
    private Integer currentParticipants;

    private String imageUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ETStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;
}
