import type { User } from "@/features/users/data/schema";
import { users } from "@/features/users/data/users";
import { create } from "zustand";

interface UserLog {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  targetUserId: string;
  targetUserName: string;
  timestamp: string;
  details?: string;
}

interface UsersStore {
    users: User[];
    logs: UserLog[];
    setUsers: (users: User[]) => void;
    addUser: (user: User) => void;
    updateUser: (updatedUser: User) => void;
    deleteUser: (id: string) => void;
    addLog: (
      action: UserLog["action"],
      targetUserId: string,
      targetUserName: string,
      details?: string,
      userName?: string,
    ) => void;
}
export const useUsersStore = create<UsersStore>((set) => ({
    users: (() => {
      const saved = localStorage.getItem("local-users");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return users;
        }
      }
      return users;
    })(),

    logs: (() => {
      const savedLogs = localStorage.getItem("user-logs");
      if (savedLogs) {
        try {
          return JSON.parse(savedLogs);
        } catch {
          return [
            {
              id: "log-001",
              userId: "user-001",
              userName: "Admin",
              action: "criação",
              targetUserId: "user-002",
              targetUserName: "João Silva",
              timestamp: new Date().toISOString(),
              details: "Usuário criado com sucesso",
            },
            {
              id: "log-002",
              userId: "user-001",
              userName: "Admin",
              action: "edição",
              targetUserId: "user-002",
              targetUserName: "João Silva",
              timestamp: new Date().toISOString(),
              details: "Dados do usuário atualizados",
            },
          ];
        }
      }
      return [
        {
          id: "log-001",
          userId: "user-001",
          userName: "Admin",
          action: "criação",
          targetUserId: "user-002",
          targetUserName: "João Silva",
          timestamp: new Date().toISOString(),
          details: "Usuário criado com sucesso",
        },
        {
          id: "log-002",
          userId: "user-001",
          userName: "Admin",
          action: "edição",
          targetUserId: "user-002",
          targetUserName: "João Silva",
          timestamp: new Date().toISOString(),
          details: "Dados do usuário atualizados",
        },
      ];
    })(),

    setUsers: (users) => {
      set({ users });
      localStorage.setItem("local-users", JSON.stringify(users));
    },

    addUser: (user) =>
        set((state) => {
          const newUsers = [user, ...state.users];
          localStorage.setItem("local-users", JSON.stringify(newUsers));
          return { users: newUsers };
        }),

    updateUser: (updatedUser) =>
        set((state) => {
          const newUsers = state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
          localStorage.setItem("local-users", JSON.stringify(newUsers));
          return { users: newUsers };
        }),

    deleteUser: (id) =>
        set((state) => {
          const newUsers = state.users.filter((user) => user.id !== id);
          localStorage.setItem("local-users", JSON.stringify(newUsers));
          return { users: newUsers };
        }),

    addLog: (
      action,
      targetUserId,
      targetUserName,
      details,
      userName,
    ) => {
      const newLog: UserLog = {
        id: crypto.randomUUID(),
        userId: "user-001",
        userName: userName || "Usuário Sistema",
        action,
        targetUserId,
        targetUserName,
        timestamp: new Date().toISOString(),
        details,
      };
      set((state) => {
        const newLogs = [newLog, ...state.logs];
        localStorage.setItem("user-logs", JSON.stringify(newLogs));
        return { logs: newLogs };
      });
      console.log(`[USER LOG] ${action.toUpperCase()}:`, newLog);
    },
}));