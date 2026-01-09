import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { UsersViewDialog } from './users-view-dialog'
import { UsersToggleStatusDialog } from './users-toggle-status-dialog'
import { useUsers } from './users-provider'
import { useAuthStore } from '@/stores/auth-store'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  const { auth } = useAuthStore()
  const roles = auth.user?.role ?? []
  return (
    <>
      {(roles.includes('general_administrator') || roles.includes('project_administrator')) && (
        <UsersInviteDialog
          key='user-invite'
          open={open === 'invite'}
          onOpenChange={() => setOpen('invite')}
        />
      )}

      {currentRow && (
        <>
          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersViewDialog
            key={`user-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersToggleStatusDialog
            key={`user-toggle-${currentRow.id}`}
            open={open === 'toggleStatus'}
            onOpenChange={() => {
              setOpen('toggleStatus')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
