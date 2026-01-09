import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
import type { Option } from "../types/question";
import { useEffect, useRef } from "react";

interface OptionsBuilderProps {
  questionId: string;
  options: Option[];
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const inputs = containerRef.current.querySelectorAll("input");
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;

      if (lastInput && lastInput.value === "") {
        lastInput.focus();
      }
    }
  }, [options.length]);

  return (
    <Droppable droppableId={`options-${questionId}`} type="OPTION">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={(node) => {
            provided.innerRef(node);
            containerRef.current = node;
          }}
          className="pl-8 space-y-1"
        >
          {options.map((option, idx) => (
            <Draggable key={option.id} draggableId={option.id} index={idx}>
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

                  <div
                    className={`size-4 border-2 border-primary/40 shrink-0 ${
                      type === "select" ? "rounded-full" : ""
                    }`}
                  />

                  <Input
                    value={option.label}
                    onChange={(e) =>
                      props.onUpdateOption(questionId, idx, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();

                        if (option.label.trim() !== "") {
                          props.onAddOption(questionId);
                        }
                      }
                    }}
                    className="h-8 text-sm bg-transparent border-none focus-visible:ring-1 p-1 placeholder:text-muted-foreground/50"
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
