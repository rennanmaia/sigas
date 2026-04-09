import { ArrowLeft, MapPin, GripVertical, Edit2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type RouteWaypoint } from "../../data/routes-mock";
import { type Project } from "../../data/projects-mock";
import { type FormItem } from "@/features/forms/data/forms-mock";

interface RouteCreatePanelProps {
  projectId?: string;
  editingRouteId: string | null;
  allProjects: Project[];
  routeProjectId: string;
  routeName: string;
  routeDescription: string;
  waypoints: RouteWaypoint[];
  isAddingPoint: boolean;
  availableForms: FormItem[];
  selectedFormIds: string[];
  editingWaypointIndex: number | null;
  editingLabel: string;
  onProjectChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onToggleAddPoint: () => void;
  onRemoveWaypoint: (index: number) => void;
  onStartEditWaypoint: (index: number) => void;
  onEditLabelChange: (value: string) => void;
  onSaveLabel: (index: number) => void;
  onCancelEditWaypoint: () => void;
  onToggleForm: (formId: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export function RouteCreatePanel({
  projectId,
  editingRouteId,
  allProjects,
  routeProjectId,
  routeName,
  routeDescription,
  waypoints,
  isAddingPoint,
  availableForms,
  selectedFormIds,
  editingWaypointIndex,
  editingLabel,
  onProjectChange,
  onNameChange,
  onDescriptionChange,
  onToggleAddPoint,
  onRemoveWaypoint,
  onStartEditWaypoint,
  onEditLabelChange,
  onSaveLabel,
  onCancelEditWaypoint,
  onToggleForm,
  onSave,
  onBack,
}: RouteCreatePanelProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h3 className="font-semibold text-base">
            {editingRouteId ? "Editar Rota" : "Nova Rota"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {editingRouteId
              ? "Altere os dados ou os pontos no mapa."
              : "Preencha os dados e marque os pontos no mapa."}
          </p>
        </div>
      </div>

      <Separator className="shrink-0" />

      <ScrollArea className="flex-1 min-h-0 max-h-[50vh] lg:max-h-none">
        <div className="space-y-4 pr-1">
          {!projectId && (
            <div className="space-y-1.5">
              <Label>Projeto *</Label>
              <Select value={routeProjectId} onValueChange={onProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {allProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="route-name">Nome da Rota *</Label>
            <Input
              id="route-name"
              placeholder="Ex: Rota Ribeirinha Norte"
              value={routeName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="route-desc">Descrição</Label>
            <Textarea
              id="route-desc"
              placeholder="Descreva o percurso ou objetivo desta rota..."
              className="resize-none text-sm"
              rows={2}
              value={routeDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Pontos da Rota{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (mín. 2)
                </span>
              </Label>
              <Button
                variant={isAddingPoint ? "default" : "outline"}
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={onToggleAddPoint}
              >
                <MapPin size={12} />
                {isAddingPoint ? "Clique no mapa" : "Adicionar ponto"}
              </Button>
            </div>

            {isAddingPoint && (
              <p className="text-xs bg-muted-foreground/10 rounded px-2 py-1.5 flex items-center gap-1.5">
                <MapPin size={12} className="shrink-0" />
                Clique em qualquer lugar do mapa para adicionar um ponto.
              </p>
            )}

            {waypoints.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Nenhum ponto adicionado ainda.
              </p>
            ) : (
              <div className="space-y-1">
                {waypoints.map((wp, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md border px-2 py-1.5 bg-muted/30"
                  >
                    <GripVertical
                      size={13}
                      className="text-muted-foreground shrink-0"
                    />
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                        i === 0
                          ? "bg-green-500"
                          : i === waypoints.length - 1
                            ? "bg-red-500"
                            : "bg-blue-500",
                      )}
                    >
                      {i + 1}
                    </div>

                    {editingWaypointIndex === i ? (
                      <div className="flex flex-1 items-center gap-1 min-w-0">
                        <Input
                          autoFocus
                          className="h-6 text-xs flex-1"
                          value={editingLabel}
                          onChange={(e) => onEditLabelChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") onSaveLabel(i);
                            if (e.key === "Escape") onCancelEditWaypoint();
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => onSaveLabel(i)}
                        >
                          <Save size={11} />
                        </Button>
                      </div>
                    ) : (
                      <span
                        className="flex-1 text-xs truncate cursor-pointer hover:text-primary"
                        onClick={() => onStartEditWaypoint(i)}
                      >
                        {wp.label ||
                          `${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}
                      </span>
                    )}

                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onStartEditWaypoint(i)}
                      >
                        <Edit2 size={11} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveWaypoint(i)}
                      >
                        <X size={11} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {availableForms.length > 0 && (
            <div className="space-y-2">
              <Label>Formulários Associados</Label>
              <p className="text-xs text-muted-foreground">
                O formulário só poderá ser respondido nesta rota.
              </p>
              <div className="space-y-1.5">
                {availableForms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center gap-2.5 rounded-md border px-3 py-2 cursor-pointer transition-colors hover:bg-muted/40"
                    onClick={() => onToggleForm(form.id)}
                  >
                    <Checkbox
                      checked={selectedFormIds.includes(form.id)}
                      onCheckedChange={() => onToggleForm(form.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">
                        {form.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {form.questionsCount} questão(ões)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {routeProjectId && availableForms.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              Nenhum formulário vinculado ao projeto selecionado.
            </p>
          )}
        </div>
      </ScrollArea>

      <Button
        className="w-full gap-2 shrink-0"
        onClick={onSave}
        disabled={!routeName.trim() || waypoints.length < 2 || !routeProjectId}
      >
        <Save size={15} />
        {editingRouteId ? "Salvar Alterações" : "Salvar Rota"}
      </Button>
    </div>
  );
}
