import { create } from 'zustand';
import type { User } from '@/types/user.types';
import { toUser } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  mfaPending: boolean;        // ← add this
  login: (rawUser: any) => void;
  logout: () => void;
  setUser: (rawUser: any | null) => void;
  setMfaPending: (pending: boolean) => void;  // ← add this
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  mfaPending: false,                          // ← add this
  login: (rawUser) => set({ user: toUser(rawUser), isAuthenticated: true, mfaPending: false }),
  logout: () => set({ user: null, isAuthenticated: false, mfaPending: false }),
  setUser: (rawUser) => set({ user: rawUser ? toUser(rawUser) : null, isAuthenticated: !!rawUser }),
  setMfaPending: (pending) => set({ mfaPending: pending }),  // ← add this
}));