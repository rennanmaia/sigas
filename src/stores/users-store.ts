import type { User } from "@/features/users/data/schema";
import { users } from "@/features/users/data/users";
import { create } from "zustand";

interface UsersStore {
    users: User[];
    setUsers: (users: User[]) => void;
    addUser: (user: User) => void;
    updateUser: (updatedUser: User) => void;
    deleteUser: (id: string) => void;
}
export const useUsersStore = create<UsersStore>((set) => ({
    users: users,
    setUsers: (users) => set({ users }),
    addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),
    updateUser: (updatedUser) =>
        set((state) => ({
            users: state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        })),
    deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
}));