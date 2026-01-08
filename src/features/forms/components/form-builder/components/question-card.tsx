import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionTypeSelect } from "./question-type-select";
import { QuestionPreview } from "./question-preview";
import type { Question, QuestionType } from "../types/question";
import { ActionsBar } from "./actions-bar";
import { useEffect, useRef } from "react";
interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdateLabel: (id: string, val: string) => void;
  onUpdateType: (id: string, type: QuestionType) => void;
  onRemove: (id: string) => void;
  onToggleRequired: (id: string) => void;
  onAddQuestion: (type: QuestionType) => void;
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, idx: number, val: string) => void;
  onRemoveOption: (id: string, idx: number) => void;
}

export function QuestionCard({ question, index, ...props }: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!hasScrolled.current) {
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        hasScrolled.current = true;
      }, 150);

      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={(node) => {
            provided.innerRef(node);
            cardRef.current = node;
          }}
          {...provided.draggableProps}
          className={`relative flex flex-col md:flex-row gap-4 p-5 border-l-4 transition-all mb-4 ${
            snapshot.isDragging
              ? "shadow-2xl border-l-primary z-50 scale-[1.01] bg-white"
              : "hover:shadow-md border-l-transparent bg-card"
          }`}
        >
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2 flex-1">
                <span className="flex items-center justify-center size-6 rounded-full bg-muted text-[11px] font-bold text-muted-foreground shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 flex items-center gap-1 relative">
                  <Input
                    autoFocus={question.label === ""}
                    placeholder="Título da pergunta..."
                    className="font-semibold border-none bg-transparent focus-visible:ring-0 h-9 text-base md:text-lg p-2"
                    value={question.label}
                    onChange={(e) =>
                      props.onUpdateLabel(question.id, e.target.value)
                    }
                  />
                  {question.required && (
                    <span className="text-destructive font-bold text-lg">
                      *
                    </span>
                  )}
                </div>
              </div>

              <QuestionTypeSelect
                value={question.type}
                onChange={(val) => props.onUpdateType(question.id, val)}
              />
            </div>

            <QuestionPreview question={question} {...props} />
          </div>

          <ActionsBar
            questionId={question.id}
            required={question.required}
            onToggleRequired={props.onToggleRequired}
            onRemove={props.onRemove}
            onAdd={() => props.onAddQuestion("text")}
            dragHandleProps={provided.dragHandleProps}
          />
        </Card>
      )}
    </Draggable>
  );
}
