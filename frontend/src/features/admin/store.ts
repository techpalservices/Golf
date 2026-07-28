import { create } from 'zustand'

interface AdminState {
    managers: any | null,
    users: any | null,
    getAllManagers: (manager: any) => void,
    getAllUsers: (users: any) => void,
}

export const useAdminStore = create<AdminState>((set) => ({
    managers: null,
    users: null,
    getAllManagers: (managers) => set({managers: managers}),
    getAllUsers: (users) => set({users: users}),
}))