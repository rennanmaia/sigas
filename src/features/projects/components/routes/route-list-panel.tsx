import { Plus, ChevronRight, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type CollectionRoute } from "../../data/routes-mock";
import { type Project } from "../../data/projects-mock";

interface RouteListPanelProps {
  projectId?: string;
  visibleRoutes: CollectionRoute[];
  selectedRoute: CollectionRoute | null;
  projectFilter: string;
  allProjects: Project[];
  onFilterChange: (value: string) => void;
  onSelectRoute: (route: CollectionRoute) => void;
  onCreateRoute: () => void;
}

export function RouteListPanel({
  projectId,
  visibleRoutes,
  selectedRoute,
  projectFilter,
  allProjects,
  onFilterChange,
  onSelectRoute,
  onCreateRoute,
}: RouteListPanelProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base">Rotas de Coleta</h3>
          <p className="text-xs text-muted-foreground">
            {visibleRoutes.length} rota
            {visibleRoutes.length !== 1 ? "s" : ""} cadastrada
            {visibleRoutes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={onCreateRoute}>
          <Plus size={15} /> Nova Rota
        </Button>
      </div>

      {!projectId && (
        <Select value={projectFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Filtrar por projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os projetos</SelectItem>
            {allProjects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Separator />

      <ScrollArea className="lg:flex-1 max-h-[45vh] lg:max-h-none">
        {visibleRoutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
            <RouteIcon size={40} className="opacity-30" />
            <p className="text-sm">Nenhuma rota cadastrada.</p>
          </div>
        ) : (
          <div className="space-y-2 pr-1">
            {visibleRoutes.map((route) => (
              <div
                key={route.id}
                className={cn(
                  "group flex items-start justify-between rounded-lg border p-3 cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/40",
                  selectedRoute?.id === route.id &&
                    "border-primary bg-primary/5",
                )}
                onClick={() => onSelectRoute(route)}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <RouteIcon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{route.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {route.waypoints.length} ponto
                      {route.waypoints.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="self-center">
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );
}
