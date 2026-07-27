package com.golf.golf_project.clubs.services;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequest;
import com.golf.golf_project.clubs.dto.requests.UpdateClubRequest;
import com.golf.golf_project.clubs.dto.response.ClubDataResponse;
import com.golf.golf_project.clubs.dto.response.CreateClubResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.mappers.ClubMapper;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ClubService {

    private final ClubMapper clubMapper;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    public CreateClubResponse createClub(CreateClubRequest request) {
        Club club = clubMapper.toClub(request);

        if (!club.getOwner().getRole().getName().equals("MANAGER")) {
            throw new IllegalArgumentException("Owner should be MANAGER");
        }
        return clubMapper.toCreateClubResponse(clubRepository.save(club));
    }

    public ClubDataResponse updateClub(UpdateClubRequest request) {
        Club club = clubMapper.toClub(request);
        Authentication auth =  SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User manager = userRepository.findUserByUsername(username);

        if (!club.getOwner().getRole().getName().equals("ROLE_MANAGER")) {
            throw new IllegalArgumentException("Owner should be MANAGER");
        } else if(manager.getId() != club.getOwner().getId()) {
            throw new IllegalArgumentException("Can't make any modification, current manager is not the owner of the club");
        }

        return clubMapper.toClubDataResponse(clubRepository.save(club));
    }

    public List<ClubDataResponse> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream()
                .map(clubMapper::toClubDataResponse)
                .toList();
    }
}
