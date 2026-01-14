import { Input } from "@/components/ui/input";
import { Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "../types/question";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const MASK_OPTIONS = [
    { label: "Texto padrão", value: "none" },
    { label: "CPF", value: "cpf" },
    { label: "CNPJ", value: "cnpj" },
    { label: "Telefone (BR)", value: "phone" },
    { label: "CEP", value: "cep" },
    { label: "Placa de veículo", value: "plate" },
  ];
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
  const hasActiveMask =
    question.type === "text" &&
    question.validations?.mask &&
    question.validations.mask !== "none";

  const config = getValidationConfig();
  if (!config.min && !config.max && question.type !== "text") return null;

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

      {question.type === "text" && (
        <div
          className={`mb-4 space-y-1.5 w-full ${!hasActiveMask ? "pb-4 border-b border-blue-100/50" : ""}`}
        >
          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
            Formato
          </label>
          <Select
            value={question.validations?.mask || "none"}
            onValueChange={(val) => {
              const isNone = val === "none";
              onUpdate({
                ...question.validations,
                mask: isNone ? undefined : val,
                min: isNone ? question.validations?.min : undefined,
                max: isNone ? question.validations?.max : undefined,
              });
            }}
          >
            <SelectTrigger className="flex h-9 w-full items-center justify-between rounded-md border border-blue-200 bg-background px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors">
              <SelectValue placeholder="Selecione um formato..." />
            </SelectTrigger>
            <SelectContent>
              {MASK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!hasActiveMask && (config.min || config.max) && (
        <div className="flex flex-col sm:flex-row gap-4 items-end animate-in slide-in-from-top-2 duration-300">
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
      )}

      {hasActiveMask && (
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-blue-700 hover:bg-blue-100 h-8 gap-2 text-[10px] font-bold uppercase"
          >
            <Trash2 size={14} />
            Limpar Regra
          </Button>
        </div>
      )}
    </div>
  );
}
