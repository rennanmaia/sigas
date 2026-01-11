import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState } from "@tanstack/react-table";
import { Filter, Search } from "lucide-react";
import { passivosMock } from "../data/passives";
import { columns } from "./passive-columns";
import { useState } from "react";

export function PassivesTable() {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'risco', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: passivosMock,
        columns,
        state: { sorting, columnFilters, globalFilter },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <>
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
                placeholder="Filtrar por nome, código ou responsável..." 
                className="pl-9"
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
            />
            </div>
            <Select onValueChange={v => table.getColumn("tipo")?.setFilterValue(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="Ambiental">Ambiental</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
            </SelectContent>
            </Select>
            <Select onValueChange={v => table.getColumn("statusPlano")?.setFilterValue(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status Plano" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos Planos</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
                <SelectItem value="Não Definido">Pendente</SelectItem>
            </SelectContent>
            </Select>
            <Button variant="ghost" className="text-indigo-600"><Filter className="h-4 w-4 mr-2" /> Mais Filtros</Button>
        </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id}>
                    {hg.headers.map(header => (
                        <TableHead key={header.id} className="text-[11px] font-bold uppercase text-slate-500">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400">
                        Nenhum passivo encontrado para os filtros aplicados.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            <div className="p-4 border-t flex items-center justify-between bg-slate-50/30">
                <div className="text-xs text-slate-500">Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</div>
                <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Próximo</Button>
                </div>
            </div>
            </div>
        </>
    );
}