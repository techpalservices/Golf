package com.golf.golf_project.clubs.services;

import com.golf.golf_project.clubs.dto.requests.CreateClubRequest;
import com.golf.golf_project.clubs.dto.requests.ReassignManagerRequest;
import com.golf.golf_project.clubs.dto.requests.SearchClubRequest;
import com.golf.golf_project.clubs.dto.requests.UpdateClubRequest;
import com.golf.golf_project.clubs.dto.response.ClubDataResponse;
import com.golf.golf_project.clubs.dto.response.CreateClubResponse;
import com.golf.golf_project.clubs.dto.response.MyClubDataResponse;
import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.enums.ECStatus;
import com.golf.golf_project.clubs.mappers.ClubMapper;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ClubService {

    private final ClubMapper clubMapper;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    @Value("${SERVER_URL}")
    private String serverUrl;

    public CreateClubResponse createClub(CreateClubRequest request) {
        Club club = clubMapper.toClub(request);
        club.setStatus(ECStatus.ACTIVE);

        if (club.getOwner() != null) {
            if (!club.getOwner().getRole().getName().equals("ROLE_MANAGER")) {
                System.out.println(club.getOwner().getRole().getName());
                throw new IllegalArgumentException("Owner should be MANAGER");
            }
        }

        return clubMapper.toCreateClubResponse(clubRepository.save(club));
    }

    public MyClubDataResponse getMyClub() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        String username = auth.getName();
        User user = userRepository.findUserByUsername(username);
        Club club = clubRepository.findByOwner(user);
        if (club == null) {
            throw new IllegalArgumentException("No club found for the authenticated user");
        }
        return clubMapper.toMyClubDataResponse(club);
    }

    public ClubDataResponse updateClub(UpdateClubRequest request) {

        Club club = clubMapper.toClub(request);
        if (request.logoURL() != null) club.setLogoURL(this.uploadFile(request.logoURL()));
        if (request.coverURL() != null) club.setCoverURL(this.uploadFile(request.coverURL()));

        Authentication auth =  SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User manager = userRepository.findUserByUsername(username);

        if (!club.getOwner().getRole().getName().equals("ROLE_MANAGER")) {
            throw new IllegalArgumentException("Owner should be MANAGER");
        } else if(!manager.getId().equals(club.getOwner().getId())) {
            throw new IllegalArgumentException("Can't make any modification, current manager is not the owner of the club");
        }

        return clubMapper.toClubDataResponse(clubRepository.save(club));
    }

    public List<ClubDataResponse> getAllClubs(SearchClubRequest request) {
        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());

        ECStatus status = parseEnum(request.status(), ECStatus.class);

        Page<Club> clubs = clubRepository.searchClubs(
                wrapLike(request.name()),          // "club " → "%club %"
                wrapLike(request.city()),
                wrapLike(request.phone()),
                wrapLike(request.email()),
                status,
                wrapLike(request.ownerFirstName()),
                wrapLike(request.ownerLastName()),
                pageable
        );
        return clubs.getContent().stream()
                .map(clubMapper::toClubDataResponse)
                .toList();
    }

    public void changeClubStatus(UUID clubId, ECStatus status) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new IllegalArgumentException("Club not found"));
        club.setStatus(status);
        clubRepository.save(club);
    }

    public void reassignManager(ReassignManagerRequest reassignManagerRequest) {
        Club club = clubRepository.findById(reassignManagerRequest.clubId()).orElseThrow(() -> new IllegalArgumentException("Club not found"));
        User manager = userRepository.findById(reassignManagerRequest.managerId()).orElseThrow(() -> new IllegalArgumentException("Manager not found"));

        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new IllegalArgumentException("User is not a manager");
        }

        club.setOwner(manager);
        clubRepository.save(club);
    }

    private String wrapLike(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return "%" + value.trim().toLowerCase() + "%";
    }

    private <T extends Enum<T>> T parseEnum(String value, Class<T> enumClass) {
        if (value == null || value.isBlank()) return null;
        try {
            return Enum.valueOf(enumClass, value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String uploadFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return serverUrl + "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }
}
