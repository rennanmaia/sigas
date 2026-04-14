import { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Users,
  ClipboardList,
  PlayCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  type CollectionRoute,
  type RouteExecution,
} from "../../data/routes-mock";
import { type Project } from "../../data/projects-mock";
import { forms } from "@/features/forms/data/forms-mock";
import { useLiabilitiesStore } from "@/stores/passives-store";

interface RouteDetailPanelProps {
  projectId?: string;
  selectedRoute: CollectionRoute;
  allProjects: Project[];
  availableCollectors: { id: string; label: string }[];
  onEdit: (route: CollectionRoute) => void;
  onDelete: (routeId: string) => void;
  onBack: () => void;
  onViewExecution: (execution: RouteExecution) => void;
}

const executionStatusMap: Record<
  RouteExecution["status"],
  { label: string; icon: React.ElementType; className: string }
> = {
  em_andamento: {
    label: "Em andamento",
    icon: Clock,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  concluida: {
    label: "Concluída",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  cancelada: {
    label: "Cancelada",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function RouteDetailPanel({
  projectId,
  selectedRoute,
  allProjects,
  availableCollectors,
  onEdit,
  onDelete,
  onBack,
  onViewExecution,
}: RouteDetailPanelProps) {
  const { liabilities } = useLiabilitiesStore();
  const [execSearch, setExecSearch] = useState("");
  const [execStatusFilter, setExecStatusFilter] = useState<
    RouteExecution["status"] | "all"
  >("all");

  const routePassives = (selectedRoute.passiveIds ?? [])
    .map((id) => liabilities.find((l) => l.id === id))
    .filter(Boolean) as typeof liabilities;

  const routeCollectors = (selectedRoute.collectorIds ?? [])
    .map((id) => availableCollectors.find((c) => c.id === id))
    .filter(Boolean) as typeof availableCollectors;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <div className="shrink-0 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="min-w-0">
          <h3 className="font-semibold text-base truncate">
            {selectedRoute.name}
          </h3>
          <p className="text-xs text-muted-foreground">Detalhes da rota</p>
        </div>
      </div>

      <Separator className="shrink-0" />

      <Tabs defaultValue="info" className="flex flex-col flex-1 min-h-0">
        <TabsList className="shrink-0 w-full grid grid-cols-2">
          <TabsTrigger value="info" className="text-xs">
            Informações
          </TabsTrigger>
          <TabsTrigger value="executions" className="text-xs">
            Execuções
            {(selectedRoute.executions?.length ?? 0) > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 text-[10px] px-1 py-0 h-4"
              >
                {selectedRoute.executions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Informações ── */}
        <TabsContent value="info" className="flex-1 min-h-0 mt-2">
          <ScrollArea className="h-full max-h-[45vh] lg:max-h-none">
            <div className="space-y-4 pr-1">
              {selectedRoute.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedRoute.description}
                </p>
              )}

              {!projectId && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Projeto
                  </Label>
                  <p className="text-sm font-medium">
                    {allProjects.find((p) => p.id === selectedRoute.projectId)
                      ?.title ?? selectedRoute.projectId}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={11} /> Pontos da Rota
                </Label>
                {routePassives.length > 0 ? (
                  <div className="space-y-1">
                    {routePassives.map((p, i) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2.5 rounded-md border px-3 py-2"
                      >
                        <div
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                            i === 0
                              ? "bg-green-500"
                              : i === routePassives.length - 1
                                ? "bg-red-500"
                                : "bg-blue-500",
                          )}
                        >
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">
                            {p.nome}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {p.codigo}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : selectedRoute.waypoints &&
                  selectedRoute.waypoints.length > 0 ? (
                  <div className="space-y-1">
                    {selectedRoute.waypoints.map((wp, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-md border px-3 py-2"
                      >
                        <div
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                            i === 0
                              ? "bg-green-500"
                              : i === (selectedRoute.waypoints?.length ?? 0) - 1
                                ? "bg-red-500"
                                : "bg-blue-500",
                          )}
                        >
                          {i + 1}
                        </div>
                        <p className="text-xs">
                          {wp.label ||
                            `${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum passivo vinculado a esta rota.
                  </p>
                )}
              </div>

              {selectedRoute.formIds.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <ClipboardList size={11} /> Formulários
                  </Label>
                  <div className="space-y-1">
                    {selectedRoute.formIds.map((fid) => {
                      const form = forms.find((f) => f.id === fid);
                      if (!form) return null;
                      return (
                        <div
                          key={fid}
                          className="flex items-center gap-2.5 rounded-md border px-3 py-2"
                        >
                          <p className="text-xs">{form.title}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Users size={11} /> Coletores
                </Label>
                {routeCollectors.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum coletor vinculado.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {routeCollectors.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2.5 rounded-md border px-3 py-2"
                      >
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                          {c.label.charAt(0)}
                        </div>
                        <p className="text-xs">{c.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Criada em:</span>{" "}
                {selectedRoute.createdAt}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="executions"
          className="flex-1 min-h-0 mt-2 flex flex-col gap-2"
        >
          {selectedRoute.executions && selectedRoute.executions.length > 0 && (
            <div className="shrink-0 flex flex-col gap-1.5">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  className="pl-7 h-7 text-xs"
                  placeholder="Buscar por coletor..."
                  value={execSearch}
                  onChange={(e) => setExecSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {(
                  ["all", "concluida", "em_andamento", "cancelada"] as const
                ).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setExecStatusFilter(s)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
                      execStatusFilter === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-muted-foreground border-muted hover:bg-muted/40",
                    )}
                  >
                    {s === "all" ? "Todas" : executionStatusMap[s].label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ScrollArea className="flex-1 min-h-0 max-h-[40vh] lg:max-h-none">
            <div className="space-y-2 pr-1">
              {!selectedRoute.executions ||
              selectedRoute.executions.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
                  <PlayCircle size={36} className="opacity-30" />
                  <p className="text-sm">Nenhuma execução registrada.</p>
                </div>
              ) : (
                (() => {
                  const filtered = selectedRoute.executions.filter((exec) => {
                    const matchSearch =
                      !execSearch ||
                      exec.collectorName
                        .toLowerCase()
                        .includes(execSearch.toLowerCase());
                    const matchStatus =
                      execStatusFilter === "all" ||
                      exec.status === execStatusFilter;
                    return matchSearch && matchStatus;
                  });
                  if (filtered.length === 0) {
                    return (
                      <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                        <Search size={28} className="opacity-30" />
                        <p className="text-sm">Nenhuma execução encontrada.</p>
                      </div>
                    );
                  }
                  return filtered.map((exec) => {
                    const meta = executionStatusMap[exec.status];
                    const StatusIcon = meta.icon;
                    return (
                      <div
                        key={exec.id}
                        className="rounded-lg border p-3 space-y-2 cursor-pointer hover:bg-muted/40 transition-colors"
                        onClick={() => onViewExecution(exec)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">
                            {exec.collectorName}
                          </p>
                          <Badge
                            className={cn(
                              "text-[10px] border gap-1",
                              meta.className,
                            )}
                          >
                            <StatusIcon size={10} />
                            {meta.label}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                          <span>
                            Início:{" "}
                            {new Date(exec.startedAt).toLocaleString("pt-BR")}
                          </span>
                          {exec.finishedAt && (
                            <span>
                              Fim:{" "}
                              {new Date(exec.finishedAt).toLocaleString(
                                "pt-BR",
                              )}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {exec.visitedPassiveIds.length}/
                          {selectedRoute.passiveIds.length} pontos visitados
                        </p>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Separator className="shrink-0" />

      <div className="shrink-0 flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => onEdit(selectedRoute)}
        >
          <Edit2 size={15} /> Editar
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
          onClick={() => onDelete(selectedRoute.id)}
        >
          <Trash2 size={15} /> Remover
        </Button>
      </div>
    </div>
  );
}
