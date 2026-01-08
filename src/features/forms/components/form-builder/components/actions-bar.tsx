import { GripVertical, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionsBarProps {
  questionId: string;
  required: boolean;
  onToggleRequired: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  dragHandleProps?: any;
}

export function ActionsBar({
  questionId,
  required,
  onToggleRequired,
  onRemove,
  onAdd,
  dragHandleProps,
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
              className="h-10 w-10 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all order-4"
              onClick={() => onRemove(questionId)}
            >
              <Trash2 size={20} />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
