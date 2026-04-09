import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type CollectionRoute } from "../../data/routes-mock";
import { type Project } from "../../data/projects-mock";
import { forms } from "@/features/forms/data/forms-mock";

interface RouteDetailPanelProps {
  projectId?: string;
  selectedRoute: CollectionRoute;
  allProjects: Project[];
  onEdit: (route: CollectionRoute) => void;
  onDelete: (routeId: string) => void;
  onBack: () => void;
}

export function RouteDetailPanel({
  projectId,
  selectedRoute,
  allProjects,
  onEdit,
  onDelete,
  onBack,
}: RouteDetailPanelProps) {
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

      <ScrollArea className="flex-1 min-h-0 max-h-[50vh] lg:max-h-none">
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
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Pontos da Rota
            </Label>
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
                        : i === selectedRoute.waypoints.length - 1
                          ? "bg-red-500"
                          : "bg-blue-500",
                    )}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs">
                    {wp.label || `${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedRoute.formIds.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Formulários Associados
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

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Criada em:</span>{" "}
              {selectedRoute.createdAt}
            </div>
          </div>
        </div>
      </ScrollArea>

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
