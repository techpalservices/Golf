package com.golf.golf_project.courses.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.courses.enums.ECStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "courses")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Course extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "course_id")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int holeCount;

    @Column(nullable = false)
    private Number greenFee;

    private String description;

    @ElementCollection
    @CollectionTable(
            name = "course_images",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "image_url")
    private List<String> imagesUrls;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ECStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
}
