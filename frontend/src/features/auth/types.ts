import type { User, Role } from '@/types/user.types';
import type {EUGender} from "@/api/types.ts";

export function toUser(raw: any): User {
    const rawRole: string = raw.role ?? '';

    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        phoneNumber: raw.phoneNumber ?? '',

        status: raw.status ?? '',
        gender: (raw.gender || '') as EUGender,
        avatarURL: raw.avatarURL ?? '',
        bio: raw.bio ?? '',
        birthDate: raw.birthDate ? new Date(raw.birthDate) : new Date(0),

        role: (rawRole.replace(/^ROLE_/, '') || 'PLAYER') as Role,
        registerAt: raw.registerAt ?? '',
        clubId: raw.clubId ?? '',
        clubName: raw.clubName ?? '',

        isTotpEnabled: !!raw.isTotpEnabled,
    };
}

export interface ApiResponse<T> {
  length: number;
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
  bio: string | null;
  avatarURL: string | null;
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