import type { User, Role } from '@/types/user.types';

export function toUser(raw: any): User {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: (raw.role?.replace('ROLE_', '') || 'PLAYER') as Role,
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  gender: string | null;
  role: string;
}

export interface LoginDTO {
  identifier: string;
  password: string;
}