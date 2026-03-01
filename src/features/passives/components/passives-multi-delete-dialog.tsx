'use client'

import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { DeleteDialog, type DeleteDialogConfig } from '@/components/delete-dialog'
import { useLiabilitiesStore } from '@/stores/passives-store'

type LiabilityMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function LiabilitiesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: LiabilityMultiDeleteDialogProps<TData>) {
  const { deleteLiability } = useLiabilitiesStore()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const config: DeleteDialogConfig = {
    mode: 'multi',
    table,
    namespace: 'Liabilities',
    confirmStrategy: 'keyword',
    onDelete: (ids) => {
      const idArray = Array.isArray(ids) ? ids : [ids]
      idArray.forEach(id => deleteLiability(id))
      toast.success(
        `${selectedRows.length} ${
          selectedRows.length > 1 ? 'Liabilities' : 'liability'
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
