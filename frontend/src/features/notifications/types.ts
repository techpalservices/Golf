export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export function notificationLink(type: string): string {
  switch (type) {
    case 'RESERVATION_CONFIRMED':
    case 'RESERVATION_REJECTED':
    case 'RESERVATION_CANCELLED':
    case 'BOOKING_REMINDER':
    case 'ALTERNATIVE_SLOTS':
      return '/my-reservations';
    case 'MEMBERSHIP_APPROVED':
    case 'MEMBERSHIP_REJECTED':
      return '/my-clubs';
    case 'RESERVATION_REQUESTED':
      return '/requests';
    case 'MEMBERSHIP_REQUESTED':
      return '/members';
    case 'TOURNAMENT_ANNOUNCED':
    case 'TOURNAMENT_CANCELLED':
    case 'TOURNAMENT_STARTED':
    case 'TOURNAMENT_COMPLETED':
      return '/manage-tournaments';
    default:
      return '';
  }
}