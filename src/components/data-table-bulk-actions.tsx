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
  table: Table<TData>;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  entityName: string;
  message: string;
  title: string;
  content: string;
}

export function DataTableBulkActions<TData>({
  table,
  setShowDeleteConfirm,
  entityName,
  title,
  message,
  content
}: DataTableBulkActionsProps<TData>) {
  return (
    <>
      <BulkActionsToolbar table={table} entityName={entityName}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected'
              title={title}
            >
              <Trash2 />
              <span className='sr-only'>{message}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
    </>
  )
}
