import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState, type VisibilityState } from "@tanstack/react-table"
import { columns } from "../components/passive-columns";
import { useEffect, useState } from "react"
import { useTableUrlState, type NavigateFn } from "@/hooks/use-table-url-state";
import { RISKS, STATUS_PLANS } from "../data/passives";
import { DataTablePagination, DataTableToolbar } from "@/components/data-table";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLiabilitiesStore } from "@/stores/passives-store";
import { DataTableBulkActions } from "@/components/data-table-bulk-actions";
import { LiabilitiesMultiDeleteDialog } from "./passives-multi-delete-dialog";
import { LiabilityDialogs } from "./passives-dialog";

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PassivesTable({ search, navigate }: DataTableProps) {
    const { liabilities } = useLiabilitiesStore();
    const [rowSelection, setRowSelection] = useState({})
    const [showMultiDelete, setShowMultiDelete] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
      diasAbertoCategoria: false,
    })

    const {
        columnFilters,
        onColumnFiltersChange,
        pagination,
        onPaginationChange,
        ensurePageInRange,
    } = useTableUrlState({
        search,
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: false },
        columnFilters: [
        ],
    })

    const table = useReactTable({
        data: liabilities,
        columns,
        state: {
          sorting,
          pagination,
          rowSelection,
          columnFilters,
          columnVisibility,
        },
        enableRowSelection: true,
        onPaginationChange,
        onColumnFiltersChange,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    useEffect(() => {
        ensurePageInRange(table.getPageCount())
    }, [table, ensurePageInRange])

    return (
        <div
              className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4'
              )}
            >
              <DataTableToolbar
                table={table}
                searchPlaceholder='Filtrar passivos...'
                searchKey='nome'
                filters={[
                    {columnId: 'risco', options: RISKS.map(risco => ({ label: risco, value: risco })), title: 'Risco'},
                    {columnId: 'statusPlano', options: STATUS_PLANS.map(status => ({ label: status, value: status })), title: 'Status do Plano'},
                    {
                        columnId: 'diasAbertoCategoria',
                        title: 'Dias em Aberto',
                        options: [
                            { label: 'Até 30 dias', value: '0' },
                            { label: '31-90 dias', value: '1' },
                            { label: '91-180 dias', value: '2' },
                            { label: '+180 dias', value: '3' },
                        ],
                    },
                ]}
              />
              <div className='overflow-hidden rounded-md border'>
                 <Table>
                    <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className='group/row'>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead
                                key={header.id}
                                colSpan={header.colSpan}
                                className={cn(
                                    'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
                                )}
                            >
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                            className='group/row'
                            onClick={() => {
                                // navigateToView({
                                //     params: {
                                //     profileId: row.original.id
                                //     }
                                // })
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell
                                key={cell.id}
                                className={cn(
                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
                                )}
                            >
                                {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                                )}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className='h-24 text-center'
                        >
                            Sem resultados.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} className='mt-auto' />
            <DataTableBulkActions 
                table={table} 
                entityName="passives"
                content="Deletar passivos selecionados"
                message="Deletar passivos selecionados"
                title="Deletar passivos selecionados"
                setShowDeleteConfirm={setShowMultiDelete}
            />
            <LiabilitiesMultiDeleteDialog 
                open={showMultiDelete} 
                onOpenChange={setShowMultiDelete} 
                table={table}
            />
            <LiabilityDialogs />
        </div>
    )
}