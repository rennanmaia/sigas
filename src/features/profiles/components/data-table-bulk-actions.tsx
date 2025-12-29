import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [_, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='profile'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected profiles'
              title='Delete selected profiles'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected profiles</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected profiles</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {/* Multidelete dialog */}
    </>
  )
}
