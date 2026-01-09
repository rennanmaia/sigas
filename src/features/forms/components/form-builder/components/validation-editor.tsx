import { Input } from "@/components/ui/input";
import { Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "../types/question";

interface ValidationEditorProps {
  question: Question;
  onUpdate: (validations: any) => void;
  onRemove: () => void;
}

export function ValidationEditor({
  question,
  onUpdate,
  onRemove,
}: ValidationEditorProps) {
  const getValidationConfig = () => {
    switch (question.type) {
      case "number":
        return { min: "Valor Mínimo", max: "Valor Máximo", type: "number" };
      case "text":
      case "textarea":
        return {
          min: "Mín. Caracteres",
          max: "Máx. Caracteres",
          type: "number",
        };
      case "checkbox":
        return { min: "Mín. Opções", max: "Máx. Opções", type: "number" };
      case "date":
        return { min: "Data Mínima", max: "Data Máxima", type: "date" };
      case "file":
      case "photo":
        return { min: null, max: "Tamanho Máx (MB)", type: "number" };
      case "audio":
        return { min: null, max: "Duração Máx (seg)", type: "number" };
      default:
        return { min: null, max: null, type: undefined };
    }
  };

  const config = getValidationConfig();
  if (!config.min && !config.max) return null;

  const handleChange = (key: "min" | "max", value: string) => {
    if (value === "") {
      onUpdate({ ...question.validations, [key]: undefined });
      return;
    }
    const finalValue = config.type === "date" ? value : Number(value);
    onUpdate({ ...question.validations, [key]: finalValue });
  };

  const validateAndBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { min, max } = question.validations || {};

    if ("key" in e && e.key === "Enter") {
      e.currentTarget.blur();
    }

    if (min !== undefined && max !== undefined) {
      if (typeof min === "number" && typeof max === "number" && min > max) {
        onUpdate({ ...question.validations, max: min });
      } else if (
        typeof min === "string" &&
        typeof max === "string" &&
        min > max
      ) {
        onUpdate({ ...question.validations, max: min });
      }
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-blue-50/30 border-blue-200 shadow-sm animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between mb-3 text-blue-700 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <Settings2 size={14} />
          Regra de Validação
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {config.min && (
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
              {config.min}
            </label>
            <Input
              type={config.type}
              className="h-9 bg-background border-blue-200 focus-visible:ring-0 focus-visible:border-blue-500 transition-colors"
              placeholder="Mínimo..."
              max={question.validations?.max?.toString()}
              value={question.validations?.min ?? ""}
              onChange={(e) => handleChange("min", e.target.value)}
              onBlur={validateAndBlur}
              onKeyDown={(e) => e.key === "Enter" && validateAndBlur(e)}
            />
          </div>
        )}

        {config.max && (
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
              {config.max}
            </label>
            <Input
              type={config.type}
              className="h-9 bg-background border-blue-200 focus-visible:ring-0 focus-visible:border-blue-500 transition-colors"
              placeholder="Máximo..."
              min={question.validations?.min?.toString()}
              value={question.validations?.max ?? ""}
              onChange={(e) => handleChange("max", e.target.value)}
              onBlur={validateAndBlur}
              onKeyDown={(e) => e.key === "Enter" && validateAndBlur(e)}
            />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-blue-700 hover:bg-blue-100 h-9 shrink-0"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
