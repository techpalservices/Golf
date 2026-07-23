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
  success?: boolean;
  availableMethods?: string[];
  message: string;
  data: T;
}

export interface AuthUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: string | null;
  role: string;
}

export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface SignUpDTO {
    firstName: string;
    lastName: string;
    email: string;
    gender: string | null;
    phoneNumber: string;
    username: string;
    password: string;
}