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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Link, getRouteApi } from "@tanstack/react-router";
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

const monthOptions = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const normalizeText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getModuleTarget = (log: AuditLog) => {
  switch (log.module) {
    case "projects":
      return {
        to: "/projects/$projectId" as const,
        params: { projectId: log.entityId },
      };
    case "users":
      return {
        to: "/users/$id" as const,
        params: { id: log.entityId },
      };
    case "profiles":
      return {
        to: "/profiles/$profileId" as const,
        params: { profileId: log.entityId },
      };
    case "forms":
      return {
        to: "/forms/edit/$id" as const,
        params: { id: log.entityId },
      };
    default:
      return {
        to: "/audit" as const,
        params: {},
      };
  }
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

const route = getRouteApi("/_authenticated/audit/");

function AuditContent() {
  const search = route.useSearch();
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

  const [dateMode, setDateMode] = useState<"none" | "month-year" | "range">(
    "none",
  );
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
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

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    for (const log of allLogs) {
      const date = new Date(log.timestamp);
      if (!Number.isNaN(date.getTime())) {
        years.add(String(date.getFullYear()));
      }
    }
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [allLogs]);

  const dateFilteredLogs = useMemo(() => {
    if (dateMode === "none") {
      return allLogs;
    }

    if (dateMode === "month-year") {
      return allLogs.filter((log) => {
        const date = new Date(log.timestamp);
        if (Number.isNaN(date.getTime())) {
          return false;
        }

        const logMonth = String(date.getMonth() + 1).padStart(2, "0");
        const logYear = String(date.getFullYear());
        const monthMatches = selectedMonth === "all" || logMonth === selectedMonth;
        const yearMatches = selectedYear === "all" || logYear === selectedYear;
        return monthMatches && yearMatches;
      });
    }

    return allLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      if (Number.isNaN(logDate.getTime())) {
        return false;
      }

      if (fromDate) {
        const from = new Date(`${fromDate}T00:00:00`);
        if (logDate < from) {
          return false;
        }
      }

      if (toDate) {
        const to = new Date(`${toDate}T23:59:59.999`);
        if (logDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [allLogs, dateMode, selectedMonth, selectedYear, fromDate, toDate]);

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
      cell: ({ row }) => {
        const target = getModuleTarget(row.original);
        const moduleLabel = moduleLabels[row.original.module];
        const tooltip = `Abrir ${moduleLabel}: ${row.original.entityName}`;
        return (
          <Link
            to={target.to}
            params={target.params as never}
            className="inline-flex"
            title={tooltip}
            aria-label={`${tooltip}. Use Ctrl/Cmd + clique para abrir em nova aba.`}
          >
            <Badge
              variant="outline"
              className="gap-1.5 transition-colors hover:border-primary hover:text-primary"
            >
              {moduleIcons[row.original.module]}
              {moduleLabel}
            </Badge>
          </Link>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "action",
      header: "Ação",
      cell: ({ row }) => {
        const target = getModuleTarget(row.original);
        const moduleLabel = moduleLabels[row.original.module];
        const tooltip = `Abrir ${moduleLabel}: ${row.original.entityName}`;

        return (
          <Link
            to={target.to}
            params={target.params as never}
            className="inline-flex"
            title={tooltip}
            aria-label={`${tooltip}. Use Ctrl/Cmd + clique para abrir em nova aba.`}
          >
            <Badge
              variant="outline"
              className={`gap-1.5 transition-colors hover:border-primary hover:text-primary ${actionColors[row.original.action]}`}
            >
              {actionIcons[row.original.action]}
              {row.original.action}
            </Badge>
          </Link>
        );
      },
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
    data: dateFilteredLogs,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = normalizeText(filterValue);
      if (!search) return true;

      const timestamp = String(row.getValue("timestamp") ?? "");
      const timestampDate = new Date(timestamp);
      const formattedTimestamp = Number.isNaN(timestampDate.getTime())
        ? ""
        : format(timestampDate, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });

      const moduleValue = String(row.getValue("module") ?? "") as keyof typeof moduleLabels;
      const moduleLabel = moduleLabels[moduleValue] ?? "";
      const actionValue = String(row.getValue("action") ?? "");
      const userName = String(row.getValue("userName") ?? "");
      const userId = String(row.original.userId ?? "");
      const entityName = String(row.original.entityName ?? "");
      const entityId = String(row.original.entityId ?? "");
      const details = String(row.original.details ?? "");

      const haystack = normalizeText(
        [
          timestamp,
          formattedTimestamp,
          moduleValue,
          moduleLabel,
          actionValue,
          userName,
          userId,
          entityName,
          entityId,
          details,
        ].join(" "),
      );

      return haystack.includes(search);
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

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [dateMode, selectedMonth, selectedYear, fromDate, toDate]);

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

          <div className="flex flex-wrap items-end gap-2 rounded-md border bg-muted/30 p-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Modo de Data</p>
              <Select
                value={dateMode}
                onValueChange={(value) =>
                  setDateMode(value as "none" | "month-year" | "range")
                }
              >
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem filtro de data</SelectItem>
                  <SelectItem value="month-year">Mês / Ano</SelectItem>
                  <SelectItem value="range">Período específico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateMode === "month-year" && (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Mês</p>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Todos os meses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os meses</SelectItem>
                      {monthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Ano</p>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Todos os anos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os anos</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {dateMode === "range" && (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Data inicial</p>
                  <Input
                    type="date"
                    className="h-8 w-[170px]"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Data final</p>
                  <Input
                    type="date"
                    className="h-8 w-[170px]"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                  />
                </div>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                setDateMode("none");
                setSelectedMonth("all");
                setSelectedYear("all");
                setFromDate("");
                setToDate("");
              }}
            >
              Limpar Data
            </Button>
          </div>

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