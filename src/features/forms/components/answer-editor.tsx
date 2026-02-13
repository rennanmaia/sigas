import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Question, Option } from "./form-builder/types/question";

interface AnswerEditorProps {
  question: Question;
  answer: any;
  isEdited?: boolean;
  onSave: (questionId: string, newValue: any) => void;
}

export function AnswerEditor({
  question,
  answer,
  isEdited = false,
  onSave,
}: AnswerEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<any>(answer);

  const handleSave = () => {
    if (JSON.stringify(editValue) !== JSON.stringify(answer)) {
      onSave(question.id, editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(answer);
    setIsEditing(false);
  };

  const getDisplayValue = () => {
    if (answer === null || answer === undefined || answer === "") {
      return <span className="text-muted-foreground italic">Sem resposta</span>;
    }

    if (question.type === "select" && question.options) {
      const option = question.options.find((o: Option) => o.id === answer);
      return option?.label || answer;
    }

    if (
      question.type === "checkbox" &&
      question.options &&
      Array.isArray(answer)
    ) {
      const labels = answer
        .map((optionId: string) => {
          const option = question.options?.find(
            (o: Option) => o.id === optionId,
          );
          return option?.label || optionId;
        })
        .filter(Boolean);
      return labels.join(", ");
    }

    if (Array.isArray(answer)) {
      return answer.join(", ");
    }

    return String(answer);
  };

  const renderEditField = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="max-w-md"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="max-w-md resize-none"
            rows={4}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={editValue || ""}
            onChange={(e) =>
              setEditValue(e.target.value ? Number(e.target.value) : "")
            }
            className="max-w-md"
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="max-w-md"
          />
        );

      case "select":
        return (
          <Select
            value={editValue || ""}
            onValueChange={(value) => setEditValue(value)}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: Option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex flex-col gap-2">
            {question.options?.map((option: Option) => {
              const currentValues = Array.isArray(editValue) ? editValue : [];
              const isChecked = currentValues.includes(option.id);
              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${question.id}-${option.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEditValue([...currentValues, option.id]);
                      } else {
                        setEditValue(
                          currentValues.filter((v: string) => v !== option.id),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`edit-${question.id}-${option.id}`}>
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <Input
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="max-w-md"
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {question.label}
        </p>
        {isEdited && (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300 text-xs"
          >
            Editado
          </Badge>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {renderEditField()}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="mr-1 h-3 w-3" />
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="mr-1 h-3 w-3" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-sm flex-1">{getDisplayValue()}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Editar resposta</span>
          </Button>
        </div>
      )}
    </div>
  );
}
