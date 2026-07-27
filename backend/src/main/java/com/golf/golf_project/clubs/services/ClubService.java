package com.golf.golf_project.clubs.services;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequests;
import com.golf.golf_project.clubs.dto.response.ClubDataResponse;
import com.golf.golf_project.clubs.dto.response.CreateClubResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.mappers.ClubMapper;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ClubService {

    private final ClubMapper clubMapper;
    private final ClubRepository clubRepository;

    public CreateClubResponse createClub(CreateClubRequests request) {
        Club club = clubMapper.toClub(request);

        if (!club.getOwner().getRole().getName().equals("MANAGER")) {
            throw new IllegalArgumentException("Owner should be MANAGER");
        }
        return clubMapper.toCreateClubResponse(clubRepository.save(club));
    }

    public List<ClubDataResponse> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream()
                .map(clubMapper::toClubDataResponse)
                .toList();
    }
}
