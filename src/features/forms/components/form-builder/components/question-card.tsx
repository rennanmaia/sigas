import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionTypeSelect } from "./question-type-select";
import { QuestionPreview } from "./question-preview";
import type { Question, QuestionType } from "../types/question";
import { ActionsBar } from "./actions-bar";
import { LogicEditor } from "./logic-editor";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationEditor } from "./validation-editor";

interface QuestionCardProps {
  question: Question;
  index: number;
  allQuestions: Question[];
  error?: string;
  onUpdateLabel: (id: string, val: string) => void;
  onUpdateType: (id: string, type: QuestionType) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleRequired: (id: string) => void;
  onAddQuestion: (type: QuestionType) => void;
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, idx: number, val: string) => void;
  onRemoveOption: (id: string, idx: number) => void;
}

export const QuestionCard = memo(function QuestionCard({
  question,
  index,
  allQuestions,
  error,
  ...props
}: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const [showLogic, setShowLogic] = useState(!!question.logic);
  const [showSettings, setShowSettings] = useState(false);
  const [localLabel, setLocalLabel] = useState(question.label);
  const hasValidationSupport = !["select", "map"].includes(question.type);

  useEffect(() => {
    setLocalLabel(question.label);
  }, [question.label]);

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalLabel(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        props.onUpdateLabel(question.id, value);
      }, 50);
    },
    [question.id, props],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

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
          className={`relative flex flex-col md:flex-row gap-4 p-5 border-l-4 transition-all mb-4 overflow-hidden ${
            snapshot.isDragging
              ? "shadow-2xl border-l-primary z-50 scale-[1.01] bg-white"
              : error
                ? "border-l-destructive shadow-sm bg-destructive/5"
                : "hover:shadow-md border-l-transparent bg-card"
          }`}
        >
          <div className="flex-1 space-y-4 min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`flex items-center justify-center size-6 rounded-full text-[11px] font-bold shrink-0 ${
                    error
                      ? "bg-destructive text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 flex flex-col relative">
                  <div className="flex items-center gap-1">
                    <Input
                      autoFocus={question.label === ""}
                      placeholder="Título da pergunta..."
                      className={`font-semibold border-none bg-transparent focus-visible:ring-0 h-9 text-base md:text-lg p-2 ${
                        error
                          ? "text-destructive placeholder:text-destructive/60"
                          : ""
                      }`}
                      value={localLabel}
                      onChange={handleLabelChange}
                    />
                    {question.required && (
                      <span className="text-destructive font-bold text-lg">
                        *
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-destructive font-bold uppercase tracking-wider pl-2"
                      >
                        {error}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <QuestionTypeSelect
                value={question.type}
                onChange={(val) => props.onUpdateType(question.id, val)}
              />
            </div>

            <QuestionPreview question={question} {...props} />

            <div className="space-y-2">
              <AnimatePresence>
                {showLogic && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <LogicEditor
                      currentQuestion={question}
                      allQuestions={allQuestions}
                      onUpdateLogic={(logic) =>
                        props.onUpdateQuestion(question.id, { logic })
                      }
                      onRemoveLogic={() => {
                        props.onUpdateQuestion(question.id, {
                          logic: undefined,
                        });
                        setShowLogic(false);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ValidationEditor
                      question={question}
                      onUpdate={(vals) =>
                        props.onUpdateQuestion(question.id, {
                          validations: vals,
                        })
                      }
                      onRemove={() => {
                        props.onUpdateQuestion(question.id, {
                          validations: undefined,
                        });
                        setShowSettings(false);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <ActionsBar
            questionId={question.id}
            required={question.required}
            hasLogic={!!question.logic}
            onToggleRequired={props.onToggleRequired}
            onToggleLogic={() => setShowLogic(!showLogic)}
            onRemove={props.onRemove}
            onAdd={() => props.onAddQuestion("text")}
            dragHandleProps={provided.dragHandleProps}
            showSettingsButton={hasValidationSupport}
            hasSettings={!!question.validations}
            onToggleSettings={() => setShowSettings(!showSettings)}
            onDuplicate={props.onDuplicate}
          />
        </Card>
      )}
    </Draggable>
  );
});
