import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Profile } from '../data/schema'

type ProfileDialogType = 'add' | 'edit' | 'delete'

type ProfilesContextType = {
  open: ProfileDialogType | null
  setOpen: (str: ProfileDialogType | null) => void
  currentRow: Profile | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Profile | null>>
}

const ProfilesContext = React.createContext<ProfilesContextType | null>(null)

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProfileDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Profile | null>(null)

  return (
    <ProfilesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
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
