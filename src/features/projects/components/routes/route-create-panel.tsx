import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  ChevronUp,
  ChevronDown,
  X,
  Save,
  Search,
  Users,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Liability } from "@/features/passives/data/schema";
import { type Project } from "../../data/projects-mock";
import { type FormItem } from "@/features/forms/data/forms-mock";

interface CollectorOption {
  id: string;
  label: string;
}

interface RouteCreatePanelProps {
  projectId?: string;
  editingRouteId: string | null;
  allProjects: Project[];
  routeProjectId: string;
  routeName: string;
  routeDescription: string;
  availablePassives: Liability[];
  selectedPassiveIds: string[];
  availableCollectors: CollectorOption[];
  selectedCollectorIds: string[];
  availableForms: FormItem[];
  selectedFormIds: string[];
  onProjectChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTogglePassive: (id: string) => void;
  onMovePassiveUp: (index: number) => void;
  onMovePassiveDown: (index: number) => void;
  onRemovePassive: (id: string) => void;
  onToggleCollector: (id: string) => void;
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
  availablePassives,
  selectedPassiveIds,
  availableCollectors,
  selectedCollectorIds,
  availableForms,
  selectedFormIds,
  onProjectChange,
  onNameChange,
  onDescriptionChange,
  onTogglePassive,
  onMovePassiveUp,
  onMovePassiveDown,
  onRemovePassive,
  onToggleCollector,
  onToggleForm,
  onSave,
  onBack,
}: RouteCreatePanelProps) {
  const MAX_PASSIVES = 20;
  const [passiveSearch, setPassiveSearch] = useState("");
  const [collectorSearch, setCollectorSearch] = useState("");
  const [formSearch, setFormSearch] = useState("");

  const filteredPassives = availablePassives.filter(
    (p) =>
      !passiveSearch ||
      p.nome.toLowerCase().includes(passiveSearch.toLowerCase()) ||
      p.codigo.toLowerCase().includes(passiveSearch.toLowerCase()),
  );

  const filteredCollectors = availableCollectors.filter(
    (c) =>
      !collectorSearch ||
      c.label.toLowerCase().includes(collectorSearch.toLowerCase()),
  );

  const filteredForms = availableForms.filter(
    (f) =>
      !formSearch || f.title.toLowerCase().includes(formSearch.toLowerCase()),
  );

  function organizeMapPoints() {}

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <div className="flex items-center gap-2 shrink-0">
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
              ? "Altere os dados da rota."
              : "Selecione os passivos que compõem a rota."}
          </p>
        </div>
      </div>

      <Separator className="shrink-0" />

      <ScrollArea className="flex-1 min-h-0 max-h-[50vh] lg:max-h-none">
        <div className="space-y-5 pr-1">
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
              <Label className="flex items-center gap-1.5">
                <MapPin size={13} />
                Pontos da Rota (Passivos){" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (mín. 2, máx. {MAX_PASSIVES})
                </span>
              </Label>
              {selectedPassiveIds.length > 0 && (
                <Badge
                  variant={
                    selectedPassiveIds.length >= MAX_PASSIVES
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {selectedPassiveIds.length}/{MAX_PASSIVES}
                </Badge>
              )}
            </div>
            <Button
              className="justify-end w-max self-end"
              onClick={organizeMapPoints}
            >
              Organizar Rota <RefreshCcw />{" "}
            </Button>

            {selectedPassiveIds.length > 0 && (
              <div className="space-y-1 rounded-md border p-2 bg-muted/20">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                  Ordem da rota
                </p>
                {selectedPassiveIds.map((id, i) => {
                  const p = availablePassives.find((a) => a.id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1.5 rounded border bg-background px-2 py-1"
                    >
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                          i === 0
                            ? "bg-green-500"
                            : i === selectedPassiveIds.length - 1
                              ? "bg-red-500"
                              : "bg-blue-500",
                        )}
                      >
                        {i + 1}
                      </div>
                      <span className="flex-1 text-xs truncate">
                        {p?.nome ?? id}
                      </span>
                      <div className="flex gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          disabled={i === 0}
                          onClick={() => onMovePassiveUp(i)}
                        >
                          <ChevronUp size={11} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          disabled={i === selectedPassiveIds.length - 1}
                          onClick={() => onMovePassiveDown(i)}
                        >
                          <ChevronDown size={11} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onRemovePassive(id)}
                        >
                          <X size={11} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  className="pl-7 h-7 text-xs"
                  placeholder="Buscar passivos..."
                  value={passiveSearch}
                  onChange={(e) => setPassiveSearch(e.target.value)}
                />
              </div>
              {availablePassives.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  Nenhum passivo com coordenadas cadastradas.
                </p>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1 rounded-md border p-1">
                  {filteredPassives.map((passive) => {
                    const checked = selectedPassiveIds.includes(passive.id!);
                    const atLimit =
                      !checked && selectedPassiveIds.length >= MAX_PASSIVES;
                    return (
                      <div
                        key={passive.id}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-1.5 transition-colors",
                          atLimit
                            ? "opacity-40 cursor-not-allowed"
                            : "cursor-pointer hover:bg-muted/40",
                          checked && "bg-primary/5",
                        )}
                        onClick={() => !atLimit && onTogglePassive(passive.id!)}
                      >
                        <Checkbox
                          checked={checked}
                          disabled={atLimit}
                          onCheckedChange={() =>
                            !atLimit && onTogglePassive(passive.id!)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">
                            {passive.nome}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {passive.codigo}
                          </p>
                        </div>
                        <MapPin
                          size={10}
                          className="shrink-0 text-muted-foreground"
                        />
                      </div>
                    );
                  })}
                  {filteredPassives.length === 0 && (
                    <p className="text-xs text-muted-foreground italic text-center py-2">
                      Nenhum passivo encontrado.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Users size={13} />
              Coletores Vinculados
            </Label>
            {selectedCollectorIds.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedCollectorIds.map((id) => {
                  const c = availableCollectors.find((a) => a.id === id);
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="gap-1 pr-1 text-xs"
                    >
                      {c?.label ?? id}
                      <button
                        type="button"
                        onClick={() => onToggleCollector(id)}
                        className="rounded-sm opacity-70 hover:opacity-100"
                      >
                        <X size={10} />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  className="pl-7 h-7 text-xs"
                  placeholder="Buscar coletores..."
                  value={collectorSearch}
                  onChange={(e) => setCollectorSearch(e.target.value)}
                />
              </div>
              {availableCollectors.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  Nenhum usuário com cargo de coletor disponível.
                </p>
              ) : (
                <div className="max-h-32 overflow-y-auto space-y-1 rounded-md border p-1">
                  {filteredCollectors.map((collector) => {
                    const checked = selectedCollectorIds.includes(collector.id);
                    return (
                      <div
                        key={collector.id}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer transition-colors hover:bg-muted/40",
                          checked && "bg-primary/5",
                        )}
                        onClick={() => onToggleCollector(collector.id)}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            onToggleCollector(collector.id)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                        <span className="text-xs">{collector.label}</span>
                      </div>
                    );
                  })}
                  {filteredCollectors.length === 0 && (
                    <p className="text-xs text-muted-foreground italic text-center py-2">
                      Nenhum coletor encontrado.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {(availableForms.length > 0 || routeProjectId) && (
            <div className="space-y-2">
              <Label>Formulários Associados</Label>
              <p className="text-xs text-muted-foreground">
                Formulários que os coletores deverão preencher nesta rota.
              </p>
              {availableForms.length > 0 ? (
                <>
                  <div className="relative">
                    <Search
                      size={12}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      className="pl-7 h-7 text-xs"
                      placeholder="Buscar formulários..."
                      value={formSearch}
                      onChange={(e) => setFormSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 rounded-md border p-1">
                    {filteredForms.map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors hover:bg-muted/40"
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
                    {filteredForms.length === 0 && (
                      <p className="text-xs text-muted-foreground italic text-center py-2">
                        Nenhum formulário encontrado.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Nenhum formulário vinculado ao projeto selecionado.
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <Button
        className="w-full gap-2 shrink-0"
        onClick={onSave}
        disabled={
          !routeName.trim() || selectedPassiveIds.length < 2 || !routeProjectId
        }
      >
        <Save size={15} />
        {editingRouteId ? "Salvar Alterações" : "Salvar Rota"}
      </Button>
    </div>
  );
}
