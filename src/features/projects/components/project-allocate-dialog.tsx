import { useState } from "react";
import { Check } from "lucide-react";
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

interface AllocateItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface ProjectAllocateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  items: AllocateItem[];
  alreadySelected: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export function ProjectAllocateDialog({
  open,
  onOpenChange,
  title,
  description,
  items,
  alreadySelected,
  onConfirm,
}: ProjectAllocateDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setSelected([]);
    onOpenChange(isOpen);
  };

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const availableItems = items.filter(
    (item) => !alreadySelected.includes(item.id)
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {availableItems.length > 0 ? (
              availableItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted",
                    selected.includes(item.id) && "border-primary bg-primary/5"
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
                  {selected.includes(item.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground italic">
                Todos os itens já foram alocados.
              </p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={selected.length === 0}
            onClick={() => {
              onConfirm(selected);
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
