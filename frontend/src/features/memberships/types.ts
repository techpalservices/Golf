export type MembershipType = 'MONTHLY' | 'YEARLY' | 'VIP';

export interface Membership {
  id: string;
  offerName: string;
  clubName: string;
  location: string;
  type: MembershipType;
  price: number;
  description: string;
  benefits: string[];
  duration: string;
}