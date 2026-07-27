package com.golf.golf_project.clubs.mappers;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequest;
import com.golf.golf_project.clubs.dto.requests.UpdateClubRequest;
import com.golf.golf_project.clubs.dto.response.ClubDataResponse;
import com.golf.golf_project.clubs.dto.response.CreateClubResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.enums.ECStatus;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ClubMapper {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;

    public Club toClub(CreateClubRequest createClubRequests) {
        Club club = new Club();
        club.setName(createClubRequests.name());
        club.setAddress(createClubRequests.address());
        club.setCity(createClubRequests.city());
        club.setDdNSNumber(createClubRequests.ddNSNumber());
        club.setDdEWNumber(createClubRequests.ddEWNumber());
        club.setOwner(userRepository.findById(createClubRequests.ownerId()).orElse(null));
        club.setStatus(ECStatus.ACTIVE);

        return club;
    }

    public Club toClub(UpdateClubRequest request) {
        Club club = clubRepository.findById(request.id()).orElseThrow(() -> new IllegalArgumentException("Club not found"));
        if (request.name() != null) {
            club.setName(request.name());
        }
        if (request.address() != null) {
            club.setAddress(request.address());
        }
        if (request.city() != null) {
            club.setCity(request.city());
        }
        if (request.phone() != null) {
            club.setPhone(request.phone());
        }
        if (request.email() != null) {
            club.setEmail(request.email());
        }
        if (request.description() != null) {
            club.setDescription(request.description());
        }
        if (request.logoURL() != null) {
            club.setLogoURL(request.logoURL());
        }
        if (request.coverURL() != null) {
            club.setCoverURL(request.coverURL());
        }
        if (request.ddNSNumber() != null) {
            club.setDdNSNumber(request.ddNSNumber());
        }
        if (request.ddEWNumber() != null) {
            club.setDdEWNumber(request.ddEWNumber());
        }

        return club;
    }

    public CreateClubResponse toCreateClubResponse(Club club) {
        return new CreateClubResponse(
                club.getName(),
                club.getAddress(),
                club.getCity(),
                club.getDdNSNumber(),
                club.getDdEWNumber(),
                club.getStatus(),
                club.getOwner() != null ? club.getOwner().getId() : null
        );
    }

    public ClubDataResponse toClubDataResponse(Club club) {
        return new ClubDataResponse(
                club.getId(),
                club.getName(),
                club.getAddress(),
                club.getCity(),
                club.getPhone(),
                club.getEmail(),
                club.getLogoURL(),
                club.getCoverURL(),
                club.getDdNSNumber(),
                club.getDdEWNumber(),
                club.getStatus(),
                club.getOwner() != null ? club.getOwner().getId() : null
        );
    }
}
