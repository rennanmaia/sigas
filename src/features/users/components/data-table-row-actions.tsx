import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'
import { useTranslation } from 'react-i18next'

type DataTableRowActionsProps = {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation("users")
  const { setOpen, setCurrentRow } = useUsers()
  return (
    <div className='z-100'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DotsHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setCurrentRow(row.original)
              setOpen('view')
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {t("list.table.columns.actions.view")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setCurrentRow(row.original)
              setOpen('toggleStatus')
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {row.original.status === 'active' ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className='text-red-500!'
          >
            {t("list.table.columns.actions.delete")}
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
