import { create } from 'zustand';
import type { User } from '@/types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// costum user for testing purposes, 
// replace with actual user data from API or authentication service 
// after implementing authentication in the server side.
const user : User = {
  id: "1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "ADMIN"
}
  

export const useAuthStore = create<AuthState>((set) => ({
  user: user,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));