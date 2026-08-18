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
  bio: string,
  birthDate: Date,
  role: Role,
  registerAt: string,
  clubId: string,
  clubName: string,
  isTotpEnabled: boolean,
}

export type updateUserDataRequest = {
  firstName: string,
  lastName: string,
  gender: EUGender,
  bio: string,
  phoneNumber: string,
  birthDate: Date
}

export type updateUserPasswordRequest = {
  oldPassword: string,
  newPassword: string
}
