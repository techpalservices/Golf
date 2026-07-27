package com.golf.golf_project.clubs.mappers;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequests;
import com.golf.golf_project.clubs.dto.response.CreateClubResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.enums.ECStatus;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ClubMapper {

    private final UserRepository userRepository;

    public Club toClub(CreateClubRequests createClubRequests) {
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
}
