import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../data/schema'
import { users as initialUsers } from '../data/users'

type UsersDialogType = 'invite' | 'edit' | 'delete' | 'view' | 'toggleStatus'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialUsers)

  return (
    <UsersContext
      value={{ open, setOpen, currentRow, setCurrentRow, users, setUsers }}
    >
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
