import { useState } from "react";
import { Route as RouteIcon, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { collectionRoutes } from "@/features/projects/data/routes-mock";
import type { Liability } from "../data/schema";

interface AssignToRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPassives: Liability[];
}

export function AssignToRouteDialog({
  open,
  onOpenChange,
  selectedPassives,
}: AssignToRouteDialogProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routeSearch, setRouteSearch] = useState("");

  const filteredRoutes = collectionRoutes.filter(
    (r) =>
      !routeSearch || r.name.toLowerCase().includes(routeSearch.toLowerCase()),
  );

  const handleConfirm = () => {
    if (!selectedRouteId) return;

    const route = collectionRoutes.find((r) => r.id === selectedRouteId);
    if (!route) return;

    const newIds = selectedPassives
      .filter((p) => p.id && !route.passiveIds.includes(p.id))
      .map((p) => p.id!);

    if (newIds.length === 0) {
      toast.info("Todos os passivos selecionados já estão na rota.");
      onOpenChange(false);
      return;
    }

    route.passiveIds.push(...newIds);

    toast.success(
      `${newIds.length} passivo${newIds.length !== 1 ? "s" : ""} adicionado${newIds.length !== 1 ? "s" : ""} à rota "${route.name}".`,
    );
    setSelectedRouteId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RouteIcon size={18} />
            Adicionar à Rota
          </DialogTitle>
          <DialogDescription>
            Selecione a rota para vincular{" "}
            <strong>{selectedPassives.length}</strong> passivo
            {selectedPassives.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-8 h-8 text-sm"
            placeholder="Buscar rota..."
            value={routeSearch}
            onChange={(e) => setRouteSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="max-h-56">
          {collectionRoutes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground text-center">
              <RouteIcon size={32} className="opacity-30" />
              <p className="text-sm">Nenhuma rota cadastrada.</p>
            </div>
          ) : (
            <div className="space-y-1.5 pr-1">
              {filteredRoutes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Nenhuma rota encontrada.
                </p>
              ) : (
                filteredRoutes.map((route) => {
                  const alreadyLinked = selectedPassives.every(
                    (p) => p.id && route.passiveIds.includes(p.id),
                  );
                  return (
                    <button
                      key={route.id}
                      type="button"
                      disabled={alreadyLinked}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={cn(
                        "w-full flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        selectedRouteId === route.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/40",
                        alreadyLinked && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <RouteIcon size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {route.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {route.passiveIds.length} passivo
                          {route.passiveIds.length !== 1 ? "s" : ""} vinculado
                          {route.passiveIds.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {selectedRouteId === route.id && (
                        <Check
                          size={15}
                          className="shrink-0 text-primary mt-0.5"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!selectedRouteId} onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
