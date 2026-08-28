package com.golf.golf_project.memberships.mappers;

import com.golf.golf_project.memberships.dto.responses.SearchMembershipRequestsResponse;
import com.golf.golf_project.memberships.dto.responses.ClubMemberResponse;
import com.golf.golf_project.memberships.entities.MembershipRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class MembershipRequestMapper {

    public SearchMembershipRequestsResponse toSearchMembershipRequestsResponse(MembershipRequest request) {
        return new SearchMembershipRequestsResponse(
                request.getId(),
                request.getPlayer().getFirstName() + " " + request.getPlayer().getLastName(),
                request.getMembership().getTitle(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }

    public ClubMemberResponse toClubMemberResponse(MembershipRequest request) {
        return new ClubMemberResponse(
                request.getId(),
                request.getPlayer().getId(),
                request.getPlayer().getFirstName() + " " + request.getPlayer().getLastName(),
                request.getMembership().getTitle(),
                request.getCreatedAt(),
                request.getPlayer().getPhoneNumber()
        );
    }
}
