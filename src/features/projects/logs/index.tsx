import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "../components/projects-provider";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText,
  PenLine,
  Trash2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTablePagination, DataTableToolbar } from "@/components/data-table";

const actionIcons = {
  criação: <FileText className="h-4 w-4" />,
  edição: <PenLine className="h-4 w-4" />,
  exclusão: <Trash2 className="h-4 w-4" />,
};

const actionColors = {
  criação: "border-green-200 bg-green-50 text-green-700",
  edição: "border-blue-200 bg-blue-50 text-blue-700",
  exclusão: "border-red-200 bg-red-50 text-red-700",
};

type ProjectLog = {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  projectId: string;
  projectTitle: string;
  timestamp: string;
  details?: string;
};

export default function ProjectLogs() {
  const { logs } = useProjects();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<ProjectLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Data/Hora",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {format(new Date(row.original.timestamp), "dd/MM/yyyy HH:mm:ss", {
            locale: ptBR,
          })}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Ação",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`gap-1.5 ${actionColors[row.original.action]}`}
        >
          {actionIcons[row.original.action]}
          {row.original.action}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "userName",
      header: "Nome do Usuário",
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.original.userName}</div>
      ),
    },
    {
      accessorKey: "userId",
      header: "ID do Usuário",
      cell: ({ row }) => (
        <div className="text-xs font-mono text-muted-foreground">
          {row.original.userId}
        </div>
      ),
    },
    {
      accessorKey: "projectTitle",
      header: "Projeto",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.projectTitle}</div>
      ),
    },
    {
      accessorKey: "projectId",
      header: "ID do Projeto",
      cell: ({ row }) => (
        <div className="text-xs font-mono text-muted-foreground">
          {row.original.projectId}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Detalhes",
      cell: ({ row }) => {
        const log = row.original;
        return (
          <Button asChild variant="ghost" size="sm" className="h-7 px-2">
            <Link to="/projects/logs/$logId" params={{ logId: log.id }}>
              <Eye className="h-4 w-4 mr-1" />
              Ver detalhes
            </Link>
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: logs,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const totalPages = table.getPageCount();
    if (pagination.pageIndex >= totalPages && totalPages > 0) {
      setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }));
    }
  }, [table, pagination.pageIndex]);

  return (
    <>
      <Header fixed>
        <Button asChild variant="ghost" size="sm">
          <Link to="/projects" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
        </Button>
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Histórico de Projetos
            </h2>
            <p className="text-muted-foreground">
              Registro de todas as ações realizadas nos projetos
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Filtrar por usuário ou projeto..."
            searchKey="projectTitle"
            filters={[
              {
                columnId: "action",
                title: "Ação",
                options: [
                  { label: "Criação", value: "criação", icon: FileText },
                  { label: "Edição", value: "edição", icon: PenLine },
                  { label: "Exclusão", value: "exclusão", icon: Trash2 },
                ],
              },
            ]}
          />
          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} className="mt-auto" />
        </div>
      </Main>
    </>
  );
}
