import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus, Trash2 } from "lucide-react";
import type {
  Section,
  SectionNavigation,
  SectionNavigationRule,
} from "../types/question";

interface SectionNavigationEditorProps {
  section: Section;
  sectionIndex: number;
  allSections: Section[];
  onUpdateNavigation: (nav: SectionNavigation | undefined) => void;
}

export function SectionNavigationEditor({
  section,
  allSections,
  onUpdateNavigation,
}: SectionNavigationEditorProps) {
  const nav: SectionNavigation = section.navigation ?? {
    defaultNext: "next",
    rules: [],
  };

  const otherSections = allSections.filter((s) => s.id !== section.id);
  const selectQuestions = section.questions.filter(
    (q) => q.type === "select" || q.type === "checkbox",
  );

  const updateDefaultNext = (value: string) => {
    onUpdateNavigation({ ...nav, defaultNext: value });
  };

  const addRule = () => {
    const newRule: SectionNavigationRule = {
      id: crypto.randomUUID(),
      dependsOnQuestionId: "",
      condition: "is",
      value: "",
      goToSectionId: "next",
    };
    onUpdateNavigation({ ...nav, rules: [...(nav.rules ?? []), newRule] });
  };

  const updateRule = (
    ruleId: string,
    updates: Partial<SectionNavigationRule>,
  ) => {
    onUpdateNavigation({
      ...nav,
      rules: (nav.rules ?? []).map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r,
      ),
    });
  };

  const removeRule = (ruleId: string) => {
    onUpdateNavigation({
      ...nav,
      rules: (nav.rules ?? []).filter((r) => r.id !== ruleId),
    });
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-violet-50/50 border-violet-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-violet-700 text-xs font-bold uppercase tracking-wider">
        <GitBranch size={14} />
        Fluxo de Navegação
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
            Após concluir esta seção, ir para:
          </label>
          <Select value={nav.defaultNext} onValueChange={updateDefaultNext}>
            <SelectTrigger className="h-9 bg-background border-violet-200 focus:ring-violet-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Próxima seção</SelectItem>
              <SelectItem value="end">Encerrar formulário</SelectItem>
              {otherSections.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(nav.rules ?? []).map((rule) => {
          const selectedQuestion = selectQuestions.find(
            (q) => q.id === rule.dependsOnQuestionId,
          );

          return (
            <div
              key={rule.id}
              className="p-3 bg-background border border-violet-100 rounded-md space-y-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-violet-600">
                  Regra Condicional
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeRule(rule.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={rule.dependsOnQuestionId}
                  onValueChange={(val) =>
                    updateRule(rule.id, {
                      dependsOnQuestionId: val,
                      value: "",
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue placeholder="Se a pergunta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectQuestions.length > 0 ? (
                      selectQuestions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.label || `Pergunta (${q.id.slice(0, 4)})`}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-muted-foreground">
                        Nenhuma pergunta de seleção nesta seção
                      </div>
                    )}
                  </SelectContent>
                </Select>

                <Select
                  disabled={!selectedQuestion}
                  value={rule.value}
                  onValueChange={(val) => updateRule(rule.id, { value: val })}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue
                      placeholder={
                        selectedQuestion
                          ? "For igual a..."
                          : "Selecione a pergunta"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedQuestion?.options?.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={rule.goToSectionId}
                  onValueChange={(val) =>
                    updateRule(rule.id, { goToSectionId: val })
                  }
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue placeholder="Ir para..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Próxima seção</SelectItem>
                    <SelectItem value="end">Encerrar formulário</SelectItem>
                    {otherSections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}

        {selectQuestions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-violet-200 text-violet-700 hover:bg-violet-50"
            onClick={addRule}
          >
            <Plus size={14} className="mr-1" />
            Adicionar regra condicional
          </Button>
        )}
      </div>
    </div>
  );
}
