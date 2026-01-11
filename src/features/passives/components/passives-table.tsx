import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState, type VisibilityState } from "@tanstack/react-table"
import { columns } from "../components/passive-columns";
import { useEffect, useState } from "react"
import { useTableUrlState, type NavigateFn } from "@/hooks/use-table-url-state";
import { passivosMock } from "../data/passives";
import { DataTableToolbar } from "@/components/data-table";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PassivesTable({ search, navigate }: DataTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

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
        columnFilters: [],
    })

    const table = useReactTable({
        data: passivosMock,
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
                searchPlaceholder='Filter passives...'
                searchKey='label'
                filters={[]}
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
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            {/* <DataTablePagination table={table} className='mt-auto' />
            <DataTableBulkActions table={table} /> */}
        </div>
    )
}