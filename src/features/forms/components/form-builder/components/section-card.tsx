import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "./question-card";
import { SectionNavigationEditor } from "./section-navigation-editor";
import type {
  Section,
  Question,
  QuestionType,
  SectionNavigation,
} from "../types/question";
import { ChevronUp, ChevronDown, Trash2, GitBranch, Plus } from "lucide-react";
import { useState, memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionCardProps {
  section: Section;
  sectionIndex: number;
  totalSections: number;
  allSections: Section[];
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  sectionErrors?: any;
  onUpdateSection: (updates: Partial<Section>) => void;
  onRemoveSection: () => void;
  onAddQuestion: (type: QuestionType, atIndex?: number) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onUpdateLabel: (id: string, val: string) => void;
  onUpdateType: (id: string, type: QuestionType) => void;
  onRemove: (id: string) => void;
  onToggleRequired: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, idx: number, val: string) => void;
  onRemoveOption: (id: string, idx: number) => void;
}

export const SectionCard = memo(function SectionCard({
  section,
  sectionIndex,
  totalSections,
  allSections,
  onMoveUp,
  onMoveDown,
  sectionErrors,
  onUpdateSection,
  onRemoveSection,
  onAddQuestion,
  onUpdateQuestion,
  onUpdateLabel,
  onUpdateType,
  onRemove,
  onToggleRequired,
  onDuplicate,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: SectionCardProps) {
  const [showNavEditor, setShowNavEditor] = useState(false);
  const [localTitle, setLocalTitle] = useState(section.title);

  return (
    <div className="border-2 rounded-xl transition-shadow border-border/50 bg-muted/10">
      <div className="flex items-center gap-2 p-3 md:p-4 border-b border-border/30 bg-background/60 rounded-t-xl">
        <div className="flex flex-col gap-0.5 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground hover:text-primary"
                  disabled={!onMoveUp}
                  onClick={onMoveUp}
                >
                  <ChevronUp size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Mover seção para cima
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground hover:text-primary"
                  disabled={!onMoveDown}
                  onClick={onMoveDown}
                >
                  <ChevronDown size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Mover seção para baixo
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <span className="text-xs font-bold text-muted-foreground border border-border/50 rounded px-1.5 py-0.5 shrink-0 bg-background">
          {sectionIndex + 1}
        </span>

        <Input
          value={localTitle}
          onChange={(e) => {
            setLocalTitle(e.target.value);
            onUpdateSection({ title: e.target.value });
          }}
          className="font-semibold border-none shadow-none focus-visible:ring-0 h-8 bg-transparent flex-1 text-sm"
          placeholder="Título da seção..."
        />

        <div className="flex items-center gap-1 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 transition-colors ${
                    showNavEditor
                      ? "text-violet-600 bg-violet-50 hover:bg-violet-100"
                      : "text-muted-foreground hover:text-violet-600 hover:bg-violet-50"
                  }`}
                  onClick={() => setShowNavEditor(!showNavEditor)}
                >
                  <GitBranch size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {showNavEditor ? "Fechar fluxo" : "Editar fluxo de navegação"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {totalSections > 1 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={onRemoveSection}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Remover seção</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showNavEditor && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4"
          >
            <SectionNavigationEditor
              section={section}
              sectionIndex={sectionIndex}
              allSections={allSections}
              onUpdateNavigation={(nav: SectionNavigation | undefined) =>
                onUpdateSection({ navigation: nav })
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 md:p-4">
        <Droppable droppableId={`questions-${section.id}`} type="QUESTION">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4 min-h-[60px]"
            >
              <AnimatePresence initial={false}>
                {section.questions.map((q, index) => (
                  <Draggable key={q.id} draggableId={q.id} index={index}>
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                          transition: { duration: 0.2 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? provided.draggableProps.style?.transform
                            : provided.draggableProps.style?.transform,
                        }}
                      >
                        <QuestionCard
                          question={q}
                          index={index}
                          allQuestions={section.questions}
                          onUpdateQuestion={onUpdateQuestion}
                          onUpdateLabel={onUpdateLabel}
                          onUpdateType={onUpdateType}
                          onRemove={onRemove}
                          onToggleRequired={onToggleRequired}
                          onAddQuestion={(type) => onAddQuestion(type, index)}
                          onAddOption={onAddOption}
                          onUpdateOption={onUpdateOption}
                          onRemoveOption={onRemoveOption}
                          onDuplicate={onDuplicate}
                          labelError={
                            sectionErrors?.questions?.[index]?.label?.message
                          }
                          optionsError={
                            sectionErrors?.questions?.[index]?.options?.message
                          }
                          optionsErrors={
                            Array.isArray(
                              sectionErrors?.questions?.[index]?.options,
                            )
                              ? sectionErrors?.questions?.[index]?.options
                              : undefined
                          }
                        />
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {section.questions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/5 px-6 text-center mt-4">
            <Plus className="mb-2 opacity-20" size={32} />
            <p className="text-sm font-medium">Nenhuma questão nesta seção</p>
            <p className="text-xs">
              Use a barra lateral para adicionar questões
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
