"use client"

import { ConfirmDialog } from '@/components/confirm-dialog'
import { toast } from 'sonner'
import { useUsers } from './users-provider'

export function UsersToggleStatusDialog({ open, onOpenChange, currentRow }:{ open:boolean; onOpenChange:(b:boolean)=>void; currentRow:any }){
  if(!currentRow) return null
  const { users, setUsers } = useUsers()

  const handle = () => {
    const next = currentRow.status === 'active' ? 'inactive' : 'active'
    setUsers(users.map((u) => (u.id === currentRow.id ? { ...u, status: next } : u)))
    onOpenChange(false)
    toast.success(`Status changed to ${next}`)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handle}
      title={currentRow.status === 'active' ? 'Deactivate user' : 'Activate user'}
      desc={<div>Are you sure you want to {currentRow.status === 'active' ? 'deactivate' : 'activate'} <strong>{currentRow.username}</strong>?</div>}
      confirmText={currentRow.status === 'active' ? 'Deactivate' : 'Activate'}
    />
  )
}

export default UsersToggleStatusDialog
