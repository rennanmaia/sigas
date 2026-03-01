import { useState, useMemo } from "react";
import { Check, Plus, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AllocateItem {
  id: string;
  label: string;
  sublabel?: string;
  role?: string;
  status?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}
export interface SelectedMemberRole {
  id: string;
  role: string;
}

interface ProjectAllocateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  items: AllocateItem[];
  alreadySelected: string[];
  onConfirm: (selectedItems: string[] | SelectedMemberRole[]) => void;
  projectId?: string;
  showSearch?: boolean;
  roleFilters?: FilterOption[];
  statusFilters?: FilterOption[];
  assignableRoles?: FilterOption[];
}

export function ProjectAllocateDialog({
  open,
  onOpenChange,
  title,
  description,
  items,
  alreadySelected,
  onConfirm,
  projectId,
  showSearch = false,
  roleFilters,
  statusFilters,
  assignableRoles,
}: ProjectAllocateDialogProps) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelected({});
      setSearchQuery("");
      setRoleFilter("all");
      setStatusFilter("all");
    }
    onOpenChange(isOpen);
  };

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[id]) {
        delete newSelected[id];
      } else {
        newSelected[id] = assignableRoles?.[0]?.value || "collector";
      }
      return newSelected;
    });
  };
  const updateItemRole = (id: string, role: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: role,
    }));
  };

  const availableItems = items.filter(
    (item) => !alreadySelected.includes(item.id),
  );

  const filteredItems = useMemo(() => {
    return availableItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sublabel?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || item.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [availableItems, searchQuery, roleFilter, statusFilter]);

  const hasActiveFilters =
    searchQuery !== "" || roleFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>
        {projectId && (
          <div className="py-2">
            <Button
              variant="outline"
              className="w-full border-dashed gap-2"
              asChild
            >
              <Link
                to="/forms/create"
                search={{ projectId }}
                onClick={() => handleOpenChange(false)}
              >
                <Plus size={16} /> Criar Novo Formulário
              </Link>
            </Button>
          </div>
        )}

        {showSearch && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {roleFilters && roleFilters.length > 0 && (
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os papéis</SelectItem>
                    {roleFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {statusFilters && statusFilters.length > 0 && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {statusFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{filteredItems.length} resultado(s) encontrado(s)</span>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="h-[300px] pr-4 mt-4">
          <div className="space-y-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isSelected = !!selected[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted",
                      isSelected && "border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.sublabel && (
                        <span className="text-xs text-muted-foreground">
                          {item.sublabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isSelected && assignableRoles && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={selected[item.id]}
                            onValueChange={(val) =>
                              updateItemRole(item.id, val)
                            }
                          >
                            <SelectTrigger className="h-8 w-[140px] text-xs bg-background">
                              <SelectValue placeholder="Selecione a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignableRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground italic">
                {hasActiveFilters
                  ? "Nenhum resultado encontrado para os filtros aplicados."
                  : "Todos os itens já foram alocados."}
              </p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={Object.keys(selected).length === 0}
            onClick={() => {
              if (assignableRoles) {
                const selectedWithRoles = Object.entries(selected).map(
                  ([id, role]) => ({ id, role }),
                );
                onConfirm(selectedWithRoles);
              } else {
                onConfirm(Object.keys(selected));
              }
              handleOpenChange(false);
            }}
          >
            Confirmar Seleção
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
