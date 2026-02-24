'use client'

import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { DeleteDialog, type DeleteDialogConfig } from '@/components/delete-dialog'
import { useUsersStore } from '@/stores/users-store'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const { deleteUser } = useUsersStore()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const config: DeleteDialogConfig = {
    mode: 'multi',
    table,
    namespace: 'users',
    confirmStrategy: 'keyword',
    onDelete: (ids) => {
      const idArray = Array.isArray(ids) ? ids : [ids]
      idArray.forEach(id => deleteUser(id))
      toast.success(
        `${selectedRows.length} ${
          selectedRows.length > 1 ? 'users' : 'user'
        } deleted successfully`
      )
    },
    onBeforeClose: () => {
      table.resetRowSelection()
    },
  }

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      config={config}
    />
  )
}
