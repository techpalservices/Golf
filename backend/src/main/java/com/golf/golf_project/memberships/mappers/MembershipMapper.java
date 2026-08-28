package com.golf.golf_project.memberships.mappers;

import com.golf.golf_project.clubs.mappers.ClubMapper;
import com.golf.golf_project.memberships.dto.requests.CreateMembershipRequest;
import com.golf.golf_project.memberships.dto.responses.PlayerClubMembershipResponse;
import com.golf.golf_project.memberships.dto.responses.SearchMembershipResponse;
import com.golf.golf_project.memberships.dto.responses.SearchMyMembershipsResponse;
import com.golf.golf_project.memberships.entities.Membership;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@AllArgsConstructor
public class MembershipMapper {

    private final ClubMapper clubMapper;

    public SearchMyMembershipsResponse toSearchMyMembershipsResponse(Membership membership) {
        return new SearchMyMembershipsResponse(
                membership.getId(),
                membership.getTitle(),
                membership.getDescription(),
                membership.getPrice(),
                membership.getStatus().name(),
                membership.getBenefits()
        );
    }

    public SearchMembershipResponse toSearchMembershipResponse(Membership membership) {
        return new SearchMembershipResponse(
                membership.getId(),
                membership.getTitle(),
                membership.getDescription(),
                membership.getPrice(),
                membership.getStatus().name(),
                clubMapper.toClubDataResponse(membership.getClub()),
                membership.getBenefits()
        );
    }

    public Membership toMembership(CreateMembershipRequest request) {
        Membership membership = new Membership();
        membership.setTitle(request.title());
        membership.setDescription(request.description());
        membership.setPrice(request.price());
        membership.setBenefits(request.benefits());
        return membership;
    }

    public PlayerClubMembershipResponse toPlayerClubMembershipResponse(Membership membership) {
        return new PlayerClubMembershipResponse(
                membership.getClub().getId(),
                membership.getClub().getName(),
                membership.getClub().getLogoURL(),
                membership.getClub().getCity(),
                membership.getClub().getAddress(),
                membership.getId(),
                membership.getTitle(),
                membership.getDescription(),
                membership.getCreatedAt().toLocalDate(),
                // Calculate end date based on membership type or use a default
                membership.getCreatedAt().toLocalDate().plusYears(1),
                (long) membership.getClub().getCourses().size()
        );
    }
}
