package com.golf.golf_project.memberships.mappers;

import com.golf.golf_project.memberships.dto.responses.SearchMembershipRequestsResponse;
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
}
