import {
  GripVertical,
  Trash2,
  PlusCircle,
  Zap,
  Settings2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionsBarProps {
  questionId: string;
  required: boolean;
  hasLogic: boolean;
  hasSettings: boolean;
  onToggleRequired: (id: string) => void;
  onToggleLogic: () => void;
  onToggleSettings: () => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  showSettingsButton: boolean;
  onAdd: () => void;
  dragHandleProps?: any;
}

export function ActionsBar({
  questionId,
  required,
  hasLogic,
  hasSettings,
  onToggleRequired,
  onToggleLogic,
  onToggleSettings,
  onRemove,
  onDuplicate,
  onAdd,
  dragHandleProps,
  showSettingsButton,
}: ActionsBarProps) {
  return (
    <TooltipProvider>
      <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 text-muted-foreground w-10 hover:text-primary hover:bg-primary/10 transition-all order-1"
              onClick={onAdd}
            >
              <PlusCircle size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Adicionar questão abaixo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              {...dragHandleProps}
              className="p-2 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-primary hover:bg-primary/5 rounded-md transition-all order-2"
            >
              <GripVertical size={22} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Arrastar para reordenar</TooltipContent>
        </Tooltip>

        <div className="flex flex-col items-center gap-1 order-3">
          <Switch
            id={`req-${questionId}`}
            checked={required}
            onCheckedChange={() => onToggleRequired(questionId)}
            className="scale-90"
          />
          <Label
            htmlFor={`req-${questionId}`}
            className={`text-[9px] font-bold uppercase tracking-tight ${
              required ? "text-primary" : "text-muted-foreground/50"
            }`}
          >
            Req
          </Label>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-slate-900 hover:bg-slate-100 transition-all order-4"
              onClick={() => onDuplicate(questionId)}
            >
              <Copy size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Duplicar pergunta</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 transition-all order-4 ${
                hasLogic
                  ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                  : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50"
              }`}
              onClick={onToggleLogic}
            >
              <Zap size={20} className={hasLogic ? "fill-current" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {hasLogic ? "Editar Lógica" : "Adicionar Lógica"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all order-5"
              onClick={() => onRemove(questionId)}
            >
              <Trash2 size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Excluir pergunta</TooltipContent>
        </Tooltip>
        {showSettingsButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 transition-all order-4 ${
                  hasSettings
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                }`}
                onClick={onToggleSettings}
              >
                <Settings2
                  size={20}
                  className={hasSettings ? "stroke-[2.5px]" : ""}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {hasSettings ? "Editar Validações" : "Configurar Validações"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
