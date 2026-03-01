import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { roles } from '../data/data'
import type { Profile } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useTranslation } from 'react-i18next'

export const profilesColumns: ColumnDef<Profile>[] = [
    {
        id: 'select',
        header: ({ table }) => (
        <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
            className='translate-y-0.5'
        />
        ),
        meta: { className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
        cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: any) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='translate-y-0.5'
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'label',
        header: ({ column }) => {
            const { t } = useTranslation("profiles")
            return (<DataTableColumnHeader column={column} title={t("list.table.headers.role")} />)
        },
        cell: ({ row }) => {
        const val = row.getValue('label') as string
        const role = roles.find((r) => r.value === val)
        const Icon = role?.icon
        return (
            <div className='flex items-center gap-x-2'>
            {Icon && <Icon size={16} className='text-muted-foreground' />}
            <LongText className='max-w-36 ps-1'>{val}</LongText>
            </div>
        )
        },
        meta: { className: 'ps-0.5' },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            const { t } = useTranslation("profiles")
            return (<DataTableColumnHeader column={column} title={t("list.table.headers.description")} />)
        },
        cell: ({ row }) => <LongText className='max-w-xl'>{row.getValue('description')}</LongText>,
    },
    {
        accessorKey: 'permissions',
        header: ({ column }) => {
            const { t } = useTranslation("profiles")
            return (<DataTableColumnHeader column={column} title={t("list.table.headers.permissions")} />)
        },
        cell: ({ row }) => {
        const perms = (row.getValue('permissions') || []) as string[]
        return <Badge variant='outline'>{perms.length}</Badge>
        },
        enableSorting: false,
    },
    {
        id: "actions",
        cell: DataTableRowActions,
    },
]
