package com.golf.golf_project.clubs.entities;

import com.golf.golf_project.base.entities.AuditableEntity;
import com.golf.golf_project.clubs.enums.ECStatus;
import com.golf.golf_project.courses.entities.Course;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.users.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "clubs")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Club extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "club_id")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    private String phone;

    private String email;

    private String description;

    private String logoURL;

    private String coverURL;

    private String galleryURL;

    @Column(nullable = false)
    private Number ddNSNumber;

    @Column(nullable = false)
    private Number ddEWNumber;

    @Column(nullable = false)
    private ECStatus status;

    @OneToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "club", orphanRemoval = true)
    private List<Course> courses;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "club", orphanRemoval = true)
    private List<Membership> memberships;
}
