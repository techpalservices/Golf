package com.golf.golf_project.memberships.services;

import com.golf.golf_project.clubs.entities.Club;
import com.golf.golf_project.clubs.repositories.ClubRepository;
import com.golf.golf_project.memberships.dto.requests.CreateMembershipRequest;
import com.golf.golf_project.memberships.dto.requests.SearchMembershipRequest;
import com.golf.golf_project.memberships.dto.requests.SearchMyMembershipsRequest;
import com.golf.golf_project.memberships.dto.requests.UpdateMembershipRequest;
import com.golf.golf_project.memberships.dto.responses.SearchMembershipResponse;
import com.golf.golf_project.memberships.dto.responses.SearchMyMembershipsResponse;
import com.golf.golf_project.memberships.entities.Membership;
import com.golf.golf_project.memberships.enums.EMStatus;
import com.golf.golf_project.memberships.mappers.MembershipMapper;
import com.golf.golf_project.memberships.repositories.MembershipRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final ClubRepository clubRepository;
    private final MembershipMapper membershipMapper;

    public List<SearchMembershipResponse> getAllMemberships(SearchMembershipRequest request) {
        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());

        Page<Membership> memberships = membershipRepository.searchMemberships(
                wrapLike(request.title()),
                request.price(),
                request.status(),
                wrapLike(request.clubName()),
                pageable
        );

        return memberships.getContent().stream()
                .map(membershipMapper::toSearchMembershipResponse)
                .toList();
    }

    public List<SearchMyMembershipsResponse> getMyMemberships(SearchMyMembershipsRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Pageable pageable = PageRequest.of(request.page(), request.size(), Sort.by("createdAt").descending());

        Page<Membership> memberships = membershipRepository.searchMyMemberships(
                wrapLike(request.title()),
                request.price(),
                request.status(),
                wrapLike(auth.getName()),
                pageable
        );

        return memberships.getContent().stream()
                .map(membershipMapper::toSearchMyMembershipsResponse)
                .toList();
    }

    public void createMembership(CreateMembershipRequest request) {
        Membership membership = membershipMapper.toMembership(request);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Club club = clubRepository.findClubByOwnerUsername(auth.getName());

        if (club == null) {
            throw new IllegalArgumentException("The requester must be the owner of a club");
        }

        membership.setStatus(EMStatus.ACTIVE);
        membership.setClub(club);

        membershipRepository.save(membership);
    }

    private String wrapLike(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return "%" + value.trim().toLowerCase() + "%";
    }

    public void updateMembership(UpdateMembershipRequest request) {
        Membership membership = membershipRepository.findMembershipById(request.id());

        if (membership == null) {
            throw new IllegalArgumentException("Membership not found");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new IllegalArgumentException("Not authenticated");
        }

        if (!membership.getClub().getOwner().getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("The requester must be the owner of the club");
        }

        if (request.title() != null) membership.setTitle(request.title());
        if (request.price() != null) membership.setPrice(request.price());
        if (request.description() != null) membership.setDescription(request.description());
        if (request.status() != null) membership.setStatus(request.status());
        if (request.benefits() != null) membership.setBenefits(request.benefits());

        membershipRepository.save(membership);
    }
}
