import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Liability } from '../data/schema'

type LiabilityDialogType = 'delete'

type ProfilesContextType = {
  open: LiabilityDialogType | null
  setOpen: (str: LiabilityDialogType | null) => void
  currentRow: Liability | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Liability | null>>
}

const LiabilitiesContext = React.createContext<ProfilesContextType | null>(null)

export function LiabilitiesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LiabilityDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Liability | null>(null)

  return (
    <LiabilitiesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LiabilitiesContext>
  )
}

export const useLiabilities = () => {
  const liabilitiesContext = React.useContext(LiabilitiesContext)

  if (!liabilitiesContext) {
    throw new Error('useLiabilities has to be used within <LiabilitiesContext>')
  }

  return liabilitiesContext
}
