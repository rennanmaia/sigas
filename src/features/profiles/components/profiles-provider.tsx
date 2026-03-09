import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Profile } from '../data/schema'

type ProfileDialogType = 'add' | 'edit' | 'delete'

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

type ProfilesContextType = {
  open: ProfileDialogType | null
  setOpen: (str: ProfileDialogType | null) => void
  currentRow: Profile | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Profile | null>>
  profiles: Profile[]
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>
  logs: ProfileLog[]
  addLog: (
    action: ProfileLog["action"],
    profileId: string,
    profileLabel: string,
    details?: string,
    userName?: string,
  ) => void;
}

import { profiles as initialProfiles } from '../data/profiles'

const ProfilesContext = React.createContext<ProfilesContextType | null>(null)

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProfileDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("local-profiles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProfiles;
      }
    }
    return initialProfiles;
  });

  const [logs, setLogs] = useState<ProfileLog[]>(() => {
    const savedLogs = localStorage.getItem("profile-logs");
    if (savedLogs) {
      try {
        return JSON.parse(savedLogs);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("profile-logs", JSON.stringify(logs));
  }, [logs]);

  const addLog = (
    action: ProfileLog["action"],
    profileId: string,
    profileLabel: string,
    details?: string,
    userName?: string,
  ) => {
    const newLog: ProfileLog = {
      id: crypto.randomUUID(),
      userId: "user-001", // TODO: change to actual user ID
      userName: userName || "Usuário Sistema",
      action,
      profileId,
      profileLabel,
      timestamp: new Date().toISOString(),
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
    console.log(`[PROFILE LOG] ${action.toUpperCase()}:`, newLog);
  };

  return (
    <ProfilesContext value={{ open, setOpen, currentRow, setCurrentRow, profiles, setProfiles, logs, addLog }}>
      {children}
    </ProfilesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfiles = () => {
  const profilesContext = React.useContext(ProfilesContext)

  if (!profilesContext) {
    throw new Error('useProfiles has to be used within <ProfilesContext>')
  }

  return profilesContext
}
