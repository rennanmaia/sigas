import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
import type { Option } from "../types/question";
import { useEffect, useRef, useState, useCallback, memo } from "react";

interface OptionsBuilderProps {
  questionId: string;
  options: Option[];
  type: "select" | "checkbox";
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, idx: number, val: string) => void;
  onRemoveOption: (id: string, idx: number) => void;
}

const OptionItem = memo(function OptionItem({
  option,
  idx,
  type,
  questionId,
  onUpdate,
  onRemove,
  onEnter,
}: {
  option: Option;
  idx: number;
  type: "select" | "checkbox";
  questionId: string;
  onUpdate: (id: string, idx: number, val: string) => void;
  onRemove: (id: string, idx: number) => void;
  onEnter: () => void;
}) {
  const [localValue, setLocalValue] = useState(option.label);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setLocalValue(option.label);
  }, [option.label]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onUpdate(questionId, idx, value);
      }, 50);
    },
    [questionId, idx, onUpdate],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Draggable key={option.id} draggableId={option.id} index={idx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center gap-2 group p-1 rounded-md transition-colors ${
            snapshot.isDragging ? "bg-muted shadow-sm" : "hover:bg-muted/30"
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
            value={localValue}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter();
              }
            }}
            placeholder={`Opção ${idx + 1}`}
            className="flex-1 h-8 border-none bg-transparent focus-visible:ring-0 focus-visible:border-b focus-visible:border-primary/30 rounded-none px-2"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(questionId, idx)}
          >
            <X size={14} />
          </Button>
        </div>
      )}
    </Draggable>
  );
});

export const OptionsBuilder = memo(function OptionsBuilder({
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
            <OptionItem
              key={option.id}
              option={option}
              idx={idx}
              type={type}
              questionId={questionId}
              onUpdate={props.onUpdateOption}
              onRemove={props.onRemoveOption}
              onEnter={() => {
                if (option.label.trim() !== "") {
                  props.onAddOption(questionId);
                }
              }}
            />
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
});
