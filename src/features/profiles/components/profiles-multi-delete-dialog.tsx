'use client'

import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { DeleteDialog, type DeleteDialogConfig } from '@/components/delete-dialog'
import { useProfilesStore } from '@/stores/profiles-store'

type ProfileMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function ProfilesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: ProfileMultiDeleteDialogProps<TData>) {
  const { deleteProfile } = useProfilesStore()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const config: DeleteDialogConfig = {
    mode: 'multi',
    table,
    namespace: 'profiles',
    confirmStrategy: 'keyword',
    onDelete: (ids) => {
      const idArray = Array.isArray(ids) ? ids : [ids]
      idArray.forEach(id => deleteProfile(id))
      toast.success(
        `${selectedRows.length} ${
          selectedRows.length > 1 ? 'profiles' : 'profile'
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
