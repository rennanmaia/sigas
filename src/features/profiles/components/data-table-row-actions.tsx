import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Pen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Profile } from '../data/schema'
import { useProfiles } from './profiles-provider'
import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'

type DataTableRowActionsProps = {
  row: Row<Profile>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useProfiles()
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
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-[160px]'
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem>
            <Link to={`/profiles/$profileId`} params={{ profileId: row.original.id }}>
            <span className="no-underline flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View
            </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={'/profiles/edit/$id'} params={{ id: row.original.id }}>
              <span className="no-underline flex items-center">
                <Pen className="mr-2 h-4 w-4" />
                Edit
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            className='text-red-500!'
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
