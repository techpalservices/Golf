export type Role = 'PLAYER' | 'MANAGER' | 'ADMIN' | '';

export type SearchRole = 'PLAYER' | 'MANAGER' | '';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}