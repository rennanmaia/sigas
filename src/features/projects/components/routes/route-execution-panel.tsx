import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  ClipboardCheck,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type CollectionRoute,
  type RouteExecution,
} from "../../data/routes-mock";
import { forms } from "@/features/forms/data/forms-mock";
import { useLiabilitiesStore } from "@/stores/passives-store";

interface RouteExecutionPanelProps {
  selectedRoute: CollectionRoute;
  execution: RouteExecution;
  onBack: () => void;
}

const statusConfig: Record<
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

export function RouteExecutionPanel({
  selectedRoute,
  execution,
  onBack,
}: RouteExecutionPanelProps) {
  const { liabilities } = useLiabilitiesStore();
  const meta = statusConfig[execution.status];
  const StatusIcon = meta.icon;

  const orderedPassives = (selectedRoute.passiveIds ?? []).map((id) =>
    liabilities.find((l) => l.id === id),
  );

  const duration = (() => {
    if (!execution.finishedAt) return null;
    const ms =
      new Date(execution.finishedAt).getTime() -
      new Date(execution.startedAt).getTime();
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem > 0 ? `${hours}h ${rem}min` : `${hours}h`;
  })();

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      {/* Header */}
      <div className="shrink-0 flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 mt-0.5"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base">Execução da Rota</h3>
            <Badge className={cn("text-[10px] border gap-1", meta.className)}>
              <StatusIcon size={10} />
              {meta.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {selectedRoute.name}
          </p>
        </div>
      </div>

      <Separator className="shrink-0" />

      <ScrollArea className="flex-1 min-h-0 max-h-[50vh] lg:max-h-none">
        <div className="space-y-5 pr-1">
          {/* Coletor */}
          <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User size={15} />
            </div>
            <div>
              <p className="text-sm font-medium">{execution.collectorName}</p>
              <p className="text-xs text-muted-foreground">
                Coletor responsável
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border px-3 py-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Início
              </p>
              <p className="text-xs font-medium">
                {new Date(execution.startedAt).toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-lg border px-3 py-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                {execution.finishedAt ? "Conclusão" : "Em andamento"}
              </p>
              <p className="text-xs font-medium">
                {execution.finishedAt
                  ? new Date(execution.finishedAt).toLocaleString("pt-BR")
                  : "—"}
              </p>
            </div>
            {duration && (
              <div className="rounded-lg border px-3 py-2 col-span-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                  Duração total
                </p>
                <p className="text-xs font-medium">{duration}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin size={11} /> Pontos da Rota
            </Label>
            <div className="space-y-1.5">
              {orderedPassives.map((passive, i) => {
                if (!passive) return null;
                const visited = execution.visitedPassiveIds.includes(
                  passive.id!,
                );
                const detail = execution.visitDetails?.find(
                  (d) => d.passiveId === passive.id,
                );
                return (
                  <div
                    key={passive.id}
                    className={cn(
                      "rounded-md border px-3 py-2.5 transition-colors",
                      visited
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                        : "opacity-60",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                          i === 0
                            ? "bg-green-500"
                            : i === orderedPassives.length - 1
                              ? "bg-red-500"
                              : "bg-blue-500",
                        )}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">
                          {passive.nome}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {passive.codigo}
                        </p>
                      </div>
                      {visited ? (
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-emerald-600"
                        />
                      ) : (
                        <Clock
                          size={14}
                          className="shrink-0 text-muted-foreground"
                        />
                      )}
                    </div>
                    {visited && detail && (
                      <div className="mt-1.5 ml-7 flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar size={9} />
                          Visita:{" "}
                          {new Date(detail.visitedAt).toLocaleString("pt-BR")}
                        </p>
                        {detail.formApplications.length > 0 &&
                          (() => {
                            // group by formId to build tooltip lines
                            const grouped = detail.formApplications.reduce<
                              Record<string, number>
                            >(
                              (acc, fa) => ({
                                ...acc,
                                [fa.formId]: (acc[fa.formId] ?? 0) + 1,
                              }),
                              {},
                            );
                            const lines = Object.entries(grouped).map(
                              ([fid, count]) => {
                                const f = forms.find((fm) => fm.id === fid);
                                return `${f?.title ?? fid}: ${count} resposta${count !== 1 ? "s" : ""}`;
                              },
                            );
                            return (
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-default text-[10px] gap-1"
                                    >
                                      <FileText size={9} />
                                      {detail.formApplications.length} resposta
                                      {detail.formApplications.length !== 1
                                        ? "s"
                                        : ""}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    className="text-xs space-y-0.5"
                                  >
                                    {lines.map((line, i) => (
                                      <p key={i}>{line}</p>
                                    ))}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {execution.visitedPassiveIds.length}/{orderedPassives.length}{" "}
              pontos visitados
            </p>
          </div>

          {selectedRoute.formIds.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ClipboardCheck size={11} /> Formulários
              </Label>
              <div className="space-y-1.5">
                {selectedRoute.formIds.map((fid) => {
                  const form = forms.find((f) => f.id === fid);
                  if (!form) return null;
                  const count =
                    execution.visitDetails?.reduce(
                      (sum, d) =>
                        sum +
                        d.formApplications.filter((fa) => fa.formId === fid)
                          .length,
                      0,
                    ) ?? 0;
                  const answered = count > 0;
                  return (
                    <div
                      key={fid}
                      className="flex items-center gap-2.5 rounded-md border px-3 py-2"
                    >
                      <ClipboardCheck
                        size={13}
                        className={
                          answered
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">
                          {form.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {form.questionsCount} questão(ões)
                        </p>
                      </div>
                      {answered ? (
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-200 border shrink-0">
                          {count}× respondido
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          Pendente
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {execution.notes && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Observações
              </Label>
              <p className="text-sm rounded-md border px-3 py-2 text-muted-foreground">
                {execution.notes}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
