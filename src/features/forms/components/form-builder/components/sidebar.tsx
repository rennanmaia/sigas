import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlignLeft,
  CheckSquare,
  MapPin,
  FileUp,
  Mic,
  Calendar,
  Camera,
} from "lucide-react";
import type { QuestionType } from "../types/question";

interface SidebarProps {
  onAdd: (type: QuestionType) => void;
}

const MENU_ITEMS = [
  { id: "text", label: "Texto", icon: "Ab" },
  { id: "textarea", label: "Texto Longo", icon: <AlignLeft size={14} /> },
  { id: "number", label: "Número", icon: "123" },
  { id: "date", label: "Data", icon: <Calendar size={14} /> },
  { id: "select", label: "Seleção Única", icon: "List" },
  {
    id: "checkbox",
    label: "Múltipla Escolha",
    icon: <CheckSquare size={14} />,
  },
  { id: "photo", label: "Imagem", icon: <Camera size={14} /> },
  { id: "map", label: "Localização", icon: <MapPin size={14} /> },
  { id: "file", label: "Arquivo", icon: <FileUp size={14} /> },
  { id: "audio", label: "Áudio", icon: <Mic size={14} /> },
];

export function Sidebar({ onAdd }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 md:h-full shrink-0 border-b md:border-b-0 md:border-r bg-muted/20">
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <h3 className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground mb-4 hidden md:block">
            Ferramentas
          </h3>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar pb-2 md:pb-0">
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="justify-start h-9 md:h-10 px-3 text-xs shrink-0 md:shrink-1"
                onClick={() => onAdd(item.id as QuestionType)}
              >
                <span className="mr-2 font-bold opacity-70 shrink-0">
                  {item.icon}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>
    </aside>
  );
}
