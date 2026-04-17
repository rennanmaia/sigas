"use client"

import { ConfirmDialog } from '@/components/confirm-dialog'
import { toast } from 'sonner'
import { useUsersStore } from '@/stores/users-store';
import { useAuditStore } from '@/stores/audit-store';

export function UsersToggleStatusDialog({ open, onOpenChange, currentRow }:{ open:boolean; onOpenChange:(b:boolean)=>void; currentRow:any }){
  if(!currentRow) return null
  const { users, setUsers, addLog } = useUsersStore()

  const handle = () => {
    const next = currentRow.status === 'active' ? 'inactive' : 'active'
    setUsers(users.map((u) => (u.id === currentRow.id ? { ...u, status: next } : u)))
    addLog("edição", currentRow.id, currentRow.username, `Status alterado para ${next}.`)

    useAuditStore.getState().addEvent({
      userId: currentRow.id,
      userName: currentRow.username,
      action: 'outros',
      module: 'system',
      entityId: currentRow.id,
      entityName: next === 'inactive' ? 'Conta bloqueada' : 'Conta desbloqueada',
      details: `Status da conta de ${currentRow.username} alterado para ${next}.`,
    })

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
