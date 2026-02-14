import { useState, useMemo } from "react";
import { Check, Search, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ResponsibleOption {
  label: string;
  value: string;
}

interface ResponsibleSelectDialogProps {
  value?: string;
  onSelect: (value: string) => void;
  options: ResponsibleOption[];
  placeholder?: string;
}

export function ResponsibleSelectDialog({
  value,
  onSelect,
  options,
  placeholder = "Selecione o(a) Responsável",
}: ResponsibleSelectDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setOpen(false);
    setSearchQuery("");
  };

  const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start font-normal"
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials(selectedOption.label)}
                </AvatarFallback>
              </Avatar>
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Selecionar Responsável Técnico</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Escolha o gerente de projeto responsável. Use a busca para encontrar
            rapidamente.
          </p>
        </DialogHeader>

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

          {searchQuery && (
            <div className="text-xs text-muted-foreground">
              {filteredOptions.length} resultado(s) encontrado(s)
            </div>
          )}
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted",
                    value === option.value && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(option.label)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Gerente de Projeto
                      </span>
                    </div>
                  </div>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <UserCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground italic">
                  Nenhum responsável encontrado.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
