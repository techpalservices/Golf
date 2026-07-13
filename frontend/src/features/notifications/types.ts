export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO date string
  read: boolean;
  link: string;
}