import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeSwitch } from "@/components/theme-switch";
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
import { useAuditStore } from "@/stores/audit-store";
import { Link, getRouteApi } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText,
  PenLine,
  Trash2,
  LogIn,
  LogOut,
  KeyRound,
  UserX,
  UserCheck,
  Eye,
  ExternalLink,
  CalendarDays,
  BriefcaseBusiness,
  ClipboardList,
  Users,
  Shield,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  outros: <Shield className="h-4 w-4" />,
};

const actionColors = {
  criação: "border-green-200 bg-green-50 text-green-700",
  edição: "border-blue-200 bg-blue-50 text-blue-700",
  exclusão: "border-red-200 bg-red-50 text-red-700",
  outros: "border-slate-200 bg-slate-50 text-slate-700",
};

const moduleIcons = {
  projects: <BriefcaseBusiness className="h-4 w-4" />,
  forms: <ClipboardList className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  profiles: <Shield className="h-4 w-4" />,
  system: <Shield className="h-4 w-4" />,
};

const moduleLabels = {
  projects: "Projetos",
  forms: "Formulários",
  users: "Usuários",
  profiles: "Perfis",
  system: "Sistema",
};

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
  action: "criação" | "edição" | "exclusão" | "outros";
  module: "projects" | "forms" | "users" | "profiles" | "system";
  entityId: string;
  entityName: string;
  timestamp: string;
  details?: string;
};

const normalizeAction = (action: string): AuditLog["action"] => {
  if (action === "criação" || action === "edição" || action === "exclusão") {
    return action;
  }
  return "outros";
};

const getOtherActionKind = (log: AuditLog) => {
  const raw = normalizeText(`${log.entityName} ${log.details ?? ""}`);

  if (raw.includes("logout")) return "logout";
  if (raw.includes("desbloque")) return "desbloqueio";
  if (
    raw.includes("suspens") ||
    raw.includes("bloquead") ||
    raw.includes("inactive")
  ) {
    return "suspensão";
  }
  if (raw.includes("senha")) return "senha";
  if (raw.includes("login")) return "login";

  return "outros";
};

const getActionDisplay = (log: AuditLog) => {
  if (log.action !== "outros") {
    return {
      label: log.action,
      icon: actionIcons[log.action],
      className: actionColors[log.action],
    };
  }

  const kind = getOtherActionKind(log);
  switch (kind) {
    case "login":
      return {
        label: "Login",
        icon: <LogIn className="h-4 w-4" />,
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "logout":
      return {
        label: "Logout",
        icon: <LogOut className="h-4 w-4" />,
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "senha":
      return {
        label: "Senha",
        icon: <KeyRound className="h-4 w-4" />,
        className: "border-orange-200 bg-orange-50 text-orange-700",
      };
    case "suspensão":
      return {
        label: "Suspensão",
        icon: <UserX className="h-4 w-4" />,
        className: "border-rose-200 bg-rose-50 text-rose-700",
      };
    case "desbloqueio":
      return {
        label: "Desbloqueio",
        icon: <UserCheck className="h-4 w-4" />,
        className: "border-sky-200 bg-sky-50 text-sky-700",
      };
    default:
      return {
        label: "Outros",
        icon: actionIcons.outros,
        className: actionColors.outros,
      };
  }
};

const route = getRouteApi("/_authenticated/audit/");

function AuditContent() {
  const search = route.useSearch();
  const { logs: projectLogs } = useProjects();
  const { logs: formLogs } = useFormsStore();
  const { logs: profileLogs } = useProfiles();
  const { logs: userLogs } = useUsersStore();
  const { events: systemEvents } = useAuditStore();

  const requestedModule = useMemo(() => {
    if (!search.filter) return undefined;
    return ["projects", "forms", "users", "profiles", "system"].includes(search.filter)
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
  const fromDateInputRef = useRef<HTMLInputElement | null>(null);
  const toDateInputRef = useRef<HTMLInputElement | null>(null);

  const openDatePicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
    input.click();
  };

  // Combine all logs, order and limit to keep browser performance OK
  const allLogs: AuditLog[] = useMemo(() => {
    const merged = [
      ...projectLogs.map((log) => ({
        ...log,
        action: normalizeAction(log.action),
        module: "projects" as const,
        entityId: log.projectId,
        entityName: log.projectTitle,
      })),
      ...formLogs.map((log) => ({
        ...log,
        action: normalizeAction(log.action),
        module: "forms" as const,
        entityId: log.targetFormId,
        entityName: log.targetFormTitle,
      })),
      ...userLogs.map((log) => ({
        ...log,
        action: normalizeAction(log.action),
        module: "users" as const,
        entityId: log.targetUserId,
        entityName: log.targetUserName,
      })),
      ...profileLogs.map((log) => ({
        ...log,
        action: normalizeAction(log.action),
        module: "profiles" as const,
        entityId: log.profileId,
        entityName: log.profileLabel,
      })),
      ...systemEvents.map((event) => ({
        ...event,
        action: normalizeAction(event.action),
        module: "system" as const,
      })),
    ];

    return merged
      .sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 3000); // limitar para evitar crash em memória grande
  }, [projectLogs, formLogs, userLogs, profileLogs, systemEvents]);

  const dateFilteredLogs = useMemo(() => {
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
  }, [allLogs, fromDate, toDate]);


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
      cell: ({ row }) => {
        const display = getActionDisplay(row.original);

        return (
          <Badge variant="outline" className={`gap-1.5 ${display.className}`}>
            {display.icon}
            {display.label}
          </Badge>
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
      accessorKey: "entityName",
      header: "Entidade",
      cell: ({ row }) => {
        if (row.original.action === "exclusão" || row.original.module === "system") {
          return (
            <div
              className="max-w-[140px] sm:max-w-[220px] lg:max-w-[280px] truncate text-sm text-muted-foreground"
              title={row.original.entityName}
            >
              {row.original.entityName}
            </div>
          );
        }

        const target = getModuleTarget(row.original);
        const moduleLabel = moduleLabels[row.original.module];
        const tooltip = `Abrir ${moduleLabel}: ${row.original.entityName}`;

        return (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 max-w-[140px] sm:max-w-[220px] lg:max-w-[280px] px-2 justify-start"
          >
            <Link
              to={target.to}
              params={target.params as never}
              title={tooltip}
              aria-label={`${tooltip}. Use Ctrl/Cmd + clique para abrir em nova aba.`}
              className="inline-flex w-full items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1 shrink-0" />
              <span className="truncate" title={row.original.entityName}>
                {row.original.entityName}
              </span>
            </Link>
          </Button>
        );
      },
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
          case "system":
            detailRoute = "/audit/logs/$logId";
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
      const actionDisplayLabel = getActionDisplay(row.original).label;
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
          actionDisplayLabel,
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
  }, [fromDate, toDate]);

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center gap-4">
          <LanguageSwitch />
          <ThemeSwitch />
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
            extraFilters={
              <>
                <div className="relative w-full sm:w-[170px]">
                  <Input
                    ref={fromDateInputRef}
                    type="date"
                    className="h-8 w-full pr-8 text-muted-foreground [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    aria-label="Data inicial"
                    title="Data inicial"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => openDatePicker(fromDateInputRef.current)}
                    aria-label="Abrir calendário da data inicial"
                    title="Abrir calendário"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative w-full sm:w-[170px]">
                  <Input
                    ref={toDateInputRef}
                    type="date"
                    className="h-8 w-full pr-8 text-muted-foreground [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    aria-label="Data final"
                    title="Data final"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => openDatePicker(toDateInputRef.current)}
                    aria-label="Abrir calendário da data final"
                    title="Abrir calendário"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    if (fromDateInputRef.current) fromDateInputRef.current.value = "";
                    if (toDateInputRef.current) toDateInputRef.current.value = "";
                  }}
                >
                  Limpar Data
                </Button>
              </>
            }
            filters={[
              {
                columnId: "module",
                title: "Módulo",
                options: [
                  { label: "Projetos", value: "projects", icon: BriefcaseBusiness },
                  { label: "Formulários", value: "forms", icon: ClipboardList },
                  { label: "Usuários", value: "users", icon: Users },
                  { label: "Perfis", value: "profiles", icon: Shield },
                  { label: "Sistema", value: "system", icon: Shield },
                ],
              },
              {
                columnId: "action",
                title: "Ação",
                options: [
                  { label: "Criação", value: "criação", icon: FileText },
                  { label: "Edição", value: "edição", icon: PenLine },
                  { label: "Exclusão", value: "exclusão", icon: Trash2 },
                  { label: "Outros", value: "outros", icon: Shield },
                ],
              },
            ]}
          />

          <div className="overflow-x-auto rounded-md border bg-card">
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