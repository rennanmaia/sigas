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
import {
  ProjectsProvider,
  useProjects,
} from "@/features/projects/components/projects-provider";
import { FormsProvider } from "@/features/forms/components/forms-provider";
import { useFormsStore } from "@/stores/forms-store";
import {
  ProfilesProvider,
  useProfiles,
} from "@/features/profiles/components/profiles-provider";
import { useUsersStore } from "@/stores/users-store";
import { Link, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText,
  PenLine,
  Trash2,
  Eye,
  BriefcaseBusiness,
  ClipboardList,
  Users,
  Shield,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

const moduleIcons = {
  projects: <BriefcaseBusiness className="h-4 w-4" />,
  forms: <ClipboardList className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  profiles: <Shield className="h-4 w-4" />,
};

const moduleLabels = {
  projects: "Projetos",
  forms: "Formulários",
  users: "Usuários",
  profiles: "Perfis",
};

type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  module: "projects" | "forms" | "users" | "profiles";
  entityId: string;
  entityName: string;
  timestamp: string;
  details?: string;
};

function AuditContent() {
  const search = useSearch({ strict: false }) as { filter?: string };
  const { logs: projectLogs } = useProjects();
  const { logs: formLogs } = useFormsStore();
  const { logs: profileLogs } = useProfiles();
  const { logs: userLogs } = useUsersStore();

  const requestedModule = useMemo(() => {
    if (!search.filter) return undefined;
    return ["projects", "forms", "users", "profiles"].includes(search.filter)
      ? search.filter
      : undefined;
  }, [search.filter]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    if (!requestedModule) {
      setColumnFilters([]);
      return;
    }

    setColumnFilters([{ id: "module", value: requestedModule }]);
  }, [requestedModule]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Combine all logs, order and limit to keep browser performance OK
  const allLogs: AuditLog[] = useMemo(() => {
    const merged = [
      ...projectLogs.map((log) => ({
        ...log,
        module: "projects" as const,
        entityId: log.projectId,
        entityName: log.projectTitle,
      })),
      ...formLogs.map((log) => ({
        ...log,
        module: "forms" as const,
        entityId: log.targetFormId,
        entityName: log.targetFormTitle,
      })),
      ...userLogs.map((log) => ({
        ...log,
        module: "users" as const,
        entityId: log.targetUserId,
        entityName: log.targetUserName,
      })),
      ...profileLogs.map((log) => ({
        ...log,
        module: "profiles" as const,
        entityId: log.profileId,
        entityName: log.profileLabel,
      })),
    ];

    return merged
      .sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 3000); // limitar para evitar crash em memória grande
  }, [projectLogs, formLogs, userLogs, profileLogs]);

  const columns: ColumnDef<AuditLog>[] = [
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
      accessorKey: "module",
      header: "Módulo",
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1.5">
          {moduleIcons[row.original.module]}
          {moduleLabels[row.original.module]}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
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
      accessorKey: "entityName",
      header: "Entidade",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.entityName}</div>
      ),
    },
    {
      accessorKey: "entityId",
      header: "ID da Entidade",
      cell: ({ row }) => (
        <div className="text-xs font-mono text-muted-foreground">
          {row.original.entityId}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Detalhes",
      cell: ({ row }) => {
        const log = row.original;
        let detailRoute = "/";
        let detailParams = {} as { logId: string };

        switch (log.module) {
          case "projects":
            detailRoute = "/projects/logs/$logId";
            detailParams = { logId: log.id };
            break;
          case "forms":
            detailRoute = "/forms/logs/$logId";
            detailParams = { logId: log.id };
            break;
          case "users":
            detailRoute = "/users/logs/$logId";
            detailParams = { logId: log.id };
            break;
          case "profiles":
            detailRoute = "/profiles/logs/$logId";
            detailParams = { logId: log.id };
            break;
        }

        return (
          <Button asChild variant="ghost" size="sm" className="h-7 px-2">
            <Link to={detailRoute} params={detailParams}>
              <Eye className="h-4 w-4 mr-1" />
              Ver detalhes
            </Link>
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: allLogs,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      if (!search) return true;
      const fields = [
        "timestamp",
        "module",
        "action",
        "userName",
        "entityName",
        "userId",
        "entityId",
      ];

      return fields.some((field) => {
        const value = String(row.getValue(field) ?? "").toLowerCase();
        return value.includes(search);
      });
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
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium">Auditoria</h1>
        </div>
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Histórico de Auditoria
            </h2>
            <p className="text-muted-foreground">
              Registro de todas as ações realizadas no sistema
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Filtrar por data, módulo, ação, usuário, entidade..."
            filters={[
              {
                columnId: "module",
                title: "Módulo",
                options: [
                  { label: "Projetos", value: "projects", icon: BriefcaseBusiness },
                  { label: "Formulários", value: "forms", icon: ClipboardList },
                  { label: "Usuários", value: "users", icon: Users },
                  { label: "Perfis", value: "profiles", icon: Shield },
                ],
              },
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

export default function Audit() {
  return (
    <ProjectsProvider>
      <ProfilesProvider>
        <FormsProvider>
          <AuditContent />
        </FormsProvider>
      </ProfilesProvider>
    </ProjectsProvider>
  );
}