import { create } from 'zustand';
import type { Profile } from '@/features/profiles/data/schema';
import { profiles as initialProfiles } from '@/features/profiles/data/profiles';

interface ProfilesStore {
  profiles: Profile[];
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  getProfileById: (id: string) => Profile | undefined;
  getProfilesByRole: (value: string) => Profile[];
}

export const useProfilesStore = create<ProfilesStore>((set, get) => ({
  profiles: initialProfiles,

  setProfiles: (profiles) => set({ profiles }),

  addProfile: (profile) =>
    set((state) => ({
      profiles: [profile, ...state.profiles],
    })),

  updateProfile: (id, updates) =>
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === id ? { ...profile, ...updates } : profile
      ),
    })),

  deleteProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((profile) => profile.id !== id),
    })),

  getProfileById: (id) => {
    return get().profiles.find((profile) => profile.id === id);
  },

  getProfilesByRole: (value) => {
    return get().profiles.filter((profile) => profile.value === value);
  },
}));
