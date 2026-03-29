import { create } from 'zustand';
import type { Profile } from '@/features/profiles/data/schema';
import { profiles as initialProfiles } from '@/features/profiles/data/profiles';

interface ProfileLog {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  profileId: string;
  profileLabel: string;
  timestamp: string;
  details?: string;
}

interface ProfilesStore {
  profiles: Profile[];
  logs: ProfileLog[];
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  getProfileById: (id: string) => Profile | undefined;
  getProfilesByRole: (value: string) => Profile[];
  addLog: (
    action: ProfileLog["action"],
    profileId: string,
    profileLabel: string,
    details?: string,
    userName?: string,
  ) => void;
}

export const useProfilesStore = create<ProfilesStore>((set, get) => ({
  profiles: (() => {
    const saved = localStorage.getItem("local-profiles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProfiles;
      }
    }
    return initialProfiles;
  })(),

  logs: (() => {
    const savedLogs = localStorage.getItem("profile-logs");
    if (savedLogs) {
      try {
        return JSON.parse(savedLogs);
      } catch {
        return [
          {
            id: "profile-log-001",
            userId: "user-001",
            userName: "Admin",
            action: "criação",
            profileId: "generaladmin-0",
            profileLabel: "Administrador Geral",
            timestamp: new Date().toISOString(),
            details: "Perfil criado com sucesso",
          },
          {
            id: "profile-log-002",
            userId: "user-001",
            userName: "Admin",
            action: "edição",
            profileId: "generaladmin-0",
            profileLabel: "Administrador Geral",
            timestamp: new Date().toISOString(),
            details: "Permissões atualizadas",
          },
        ];
      }
    }
    return [
      {
        id: "profile-log-001",
        userId: "user-001",
        userName: "Admin",
        action: "criação",
        profileId: "generaladmin-0",
        profileLabel: "Administrador Geral",
        timestamp: new Date().toISOString(),
        details: "Perfil criado com sucesso",
      },
      {
        id: "profile-log-002",
        userId: "user-001",
        userName: "Admin",
        action: "edição",
        profileId: "generaladmin-0",
        profileLabel: "Administrador Geral",
        timestamp: new Date().toISOString(),
        details: "Permissões atualizadas",
      },
    ];
  })(),

  setProfiles: (profiles) => {
    set({ profiles });
    localStorage.setItem("local-profiles", JSON.stringify(profiles));
  },

  addProfile: (profile) =>
    set((state) => {
      const newProfiles = [profile, ...state.profiles];
      localStorage.setItem("local-profiles", JSON.stringify(newProfiles));
      return { profiles: newProfiles };
    }),

  updateProfile: (id, updates) =>
    set((state) => {
      const newProfiles = state.profiles.map((profile) =>
        profile.id === id ? { ...profile, ...updates } : profile
      );
      localStorage.setItem("local-profiles", JSON.stringify(newProfiles));
      return { profiles: newProfiles };
    }),

  deleteProfile: (id) =>
    set((state) => {
      const newProfiles = state.profiles.filter((profile) => profile.id !== id);
      localStorage.setItem("local-profiles", JSON.stringify(newProfiles));
      return { profiles: newProfiles };
    }),

  getProfileById: (id) => {
    return get().profiles.find((profile) => profile.id === id);
  },

  getProfilesByRole: (value) => {
    return get().profiles.filter((profile) => profile.value === value);
  },

  addLog: (
    action,
    profileId,
    profileLabel,
    details,
    userName,
  ) => {
    const newLog: ProfileLog = {
      id: crypto.randomUUID(),
      userId: "user-001",
      userName: userName || "Usuário Sistema",
      action,
      profileId,
      profileLabel,
      timestamp: new Date().toISOString(),
      details,
    };
    set((state) => {
      const newLogs = [newLog, ...state.logs];
      localStorage.setItem("profile-logs", JSON.stringify(newLogs));
      return { logs: newLogs };
    });
    console.log(`[PROFILE LOG] ${action.toUpperCase()}:`, newLog);
  },
}));
