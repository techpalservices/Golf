export type Role = 'PLAYER' | 'MANAGER' | 'ADMIN' | '';

export type SearchRole = 'ROLE_PLAYER' | 'ROLE_MANAGER' | '';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}