import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { columns } from "./passive-columns";
import { useState } from "react";
import { useLiabilitiesStore } from "@/stores/passives-store";
import { RISKS, STATUS_PLANS } from "../data/passives";
import { DataTablePagination, DataTableToolbar } from "@/components/data-table";
import { DataTableBulkActions } from "@/components/data-table-bulk-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiabilitiesMultiDeleteDialog } from "./passives-multi-delete-dialog";
import { LiabilityDialogs } from "./passives-dialog";
import { cn } from "@/lib/utils";

export function PassivesTable() {
  const { liabilities } = useLiabilitiesStore();
  const [rowSelection, setRowSelection] = useState({});
  const [showMultiDelete, setShowMultiDelete] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    diasAbertoCategoria: false,
  });

  const table = useReactTable({
    data: liabilities,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div
      className={cn(
        "max-sm:has-[div[role='toolbar']]:mb-16",
        "flex flex-1 flex-col gap-4",
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filtrar passivos..."
        searchKey="nome"
        filters={[
          {
            columnId: "risco",
            options: RISKS.map((r) => ({ label: r, value: r })),
            title: "Risco",
          },
          {
            columnId: "statusPlano",
            options: STATUS_PLANS.map((s) => ({ label: s, value: s })),
            title: "Status do Plano",
          },
          {
            columnId: "diasAbertoCategoria",
            title: "Dias em Aberto",
            options: [
              { label: "Até 30 dias", value: "0" },
              { label: "31-90 dias", value: "1" },
              { label: "91-180 dias", value: "2" },
              { label: "+180 dias", value: "3" },
            ],
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions
        table={table}
        entityName="passivo"
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
  );
}
