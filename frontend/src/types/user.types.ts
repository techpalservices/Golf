import type {EUGender} from "@/api/types.ts";

export type Role = 'PLAYER' | 'MANAGER' | 'ADMIN' | '';

export type SearchRole = 'ROLE_PLAYER' | 'ROLE_MANAGER' | '';

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  status: string,
  gender: EUGender,
  avatarURL: string,
  birthDate: Date,
  role: Role,
  registerAt: string,
  clubId: string,
  clubName: string,
  isTotpEnabled: boolean,
}