export type EMStatus = 'ACTIVE' | 'SUSPENDED' | '' | null;

export interface Membership {
  id: string;
  title: string;
  description: string;
  price: number;
  status: EMStatus;
  benefits: string[];
  club?: {
    id?: string;
    name?: string;
    city?: string;
    address?: string;
  };
}

export interface SearchAllMemberships {
  title: string;
  status: EMStatus;
  price: number | null;
  clubName: string;
  page: number;
  size: number;
}

export interface SearchMyMemberships {
  title: string;
  status: EMStatus;
  price: number | null;
  page: number;
  size: number;
}

export interface AddMembership {
  title: string;
  description: string;
  price: number;
  benefits: string[];
}

export interface UpdateMembership {
  id: string;
  title: string;
  description: string;
  price: number;
  status: EMStatus;
  benefits: string[];
}

export type EMRStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING';

export interface SearchMembershipRequests {
  firstName: string;
  lastName: string;
  planName: string;
  status: EMRStatus | '' | null;
  page: number;
  size: number;
}

export interface MembershipRequest {
  id: string;
  userFullName: string;
  planName: string;
  status: EMRStatus;
  createdAt: string;
}