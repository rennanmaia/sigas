import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Zap } from "lucide-react";
import type { Question } from "../types/question";

interface LogicEditorProps {
  currentQuestion: Question;
  allQuestions: Question[];
  onUpdateLogic: (logic: any) => void;
  onRemoveLogic: () => void;
}

export function LogicEditor({
  currentQuestion,
  allQuestions = [],
  onUpdateLogic,
  onRemoveLogic,
}: LogicEditorProps) {
  const currentIndex = allQuestions.findIndex(
    (q) => q.id === currentQuestion.id
  );

  const previousQuestions = allQuestions
    .slice(0, currentIndex === -1 ? 0 : currentIndex)
    .filter((q) => q.type === "select" || q.type === "checkbox");

  const selectedParent = previousQuestions.find(
    (q) => q.id === currentQuestion.logic?.dependsOnQuestionId
  );

  return (
    <div className="mt-4 p-4 border rounded-lg bg-amber-50/50 border-amber-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-amber-700 text-xs font-bold uppercase tracking-wider">
        <Zap size={14} className="fill-current" />
        Regra de Visibilidade
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
            Exibir se a pergunta:
          </label>
          <Select
            value={currentQuestion.logic?.dependsOnQuestionId}
            onValueChange={(val) =>
              onUpdateLogic({
                ...currentQuestion.logic,
                dependsOnQuestionId: val,
              })
            }
          >
            <SelectTrigger className="h-9 bg-background border-amber-200 focus:ring-amber-500">
              <SelectValue placeholder="Escolha uma pergunta anterior..." />
            </SelectTrigger>
            <SelectContent>
              {previousQuestions.length > 0 ? (
                previousQuestions.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.label || `Pergunta sem título (${q.id.slice(0, 4)})`}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-xs text-muted-foreground">
                  Nenhuma pergunta de seleção disponível acima
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
            For igual a:
          </label>
          <Select
            disabled={!selectedParent}
            value={currentQuestion.logic?.value}
            onValueChange={(val) =>
              onUpdateLogic({
                ...currentQuestion.logic,
                value: val,
                condition: "is",
              })
            }
          >
            <SelectTrigger className="h-9 bg-background border-amber-200 focus:ring-amber-500">
              <SelectValue
                placeholder={
                  selectedParent
                    ? "Escolha a opção..."
                    : "Selecione a pergunta primeiro"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {selectedParent?.options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveLogic}
          className="text-amber-700 hover:bg-amber-100 h-9 shrink-0"
          title="Remover regra"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
