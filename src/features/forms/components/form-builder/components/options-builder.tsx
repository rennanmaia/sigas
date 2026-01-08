import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";

interface OptionsBuilderProps {
  questionId: string;
  options: string[];
  type: "select" | "checkbox";
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, idx: number, val: string) => void;
  onRemoveOption: (id: string, idx: number) => void;
}

export function OptionsBuilder({
  questionId,
  options,
  type,
  ...props
}: OptionsBuilderProps) {
  return (
    <Droppable droppableId={`options-${questionId}`} type="OPTION">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="pl-8 space-y-1"
        >
          {options.map((option, idx) => (
            <Draggable
              key={`${questionId}-opt-${idx}`}
              draggableId={`${questionId}-opt-${idx}`}
              index={idx}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={`flex items-center gap-2 group p-1 rounded-md transition-colors ${
                    snapshot.isDragging
                      ? "bg-muted shadow-sm"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div
                    {...provided.dragHandleProps}
                    className="text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={14} />
                  </div>

                  {type === "select" ? (
                    <div className="size-4 rounded-full border-2 border-primary/40 shrink-0 flex items-center justify-center"></div>
                  ) : (
                    <div className="size-4 border-2 border-primary/40 shrink-0 flex items-center justify-center"></div>
                  )}

                  <Input
                    value={option}
                    onChange={(e) =>
                      props.onUpdateOption(questionId, idx, e.target.value)
                    }
                    className="h-8 text-sm bg-transparent border-none focus-visible:ring-1 p-1"
                    placeholder={`Opção ${idx + 1}`}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    onClick={() => props.onRemoveOption(questionId, idx)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary hover:bg-primary/5 h-8 ml-6 mt-1"
            onClick={() => props.onAddOption(questionId)}
          >
            <Plus size={14} className="mr-1" /> Adicionar alternativa
          </Button>
        </div>
      )}
    </Droppable>
  );
}
