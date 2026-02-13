import { useState } from "react";
import JSZip from "jszip";
import {
  Pencil,
  Check,
  X,
  Download,
  Image,
  FileText,
  Mic,
  MapPin,
} from "lucide-react";
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

  const getMockFileContent = (filename: string, type: string): string => {
    if (type === "map") {
      const coords = filename.match(/lat:([-\d.]+),lng:([-\d.]+)/);
      if (coords) {
        const lat = coords[1];
        const lng = coords[2];
        return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>Localização</name>
    <Point>
      <coordinates>${lng},${lat},0</coordinates>
    </Point>
  </Placemark>
</kml>`;
      }
    }
    return `Mock content for ${filename}`;
  };

  const handleDownload = (value: string, type: string) => {
    const mimeTypes: Record<string, string> = {
      photo: "image/jpeg",
      file: "application/pdf",
      audio: "audio/mpeg",
      map: "application/vnd.google-earth.kml+xml",
    };

    const extensions: Record<string, string> = {
      photo: "jpg",
      file: "pdf",
      audio: "mp3",
      map: "kml",
    };

    const content = getMockFileContent(value, type);
    const filename =
      type === "map"
        ? `localizacao_${Date.now()}.kml`
        : value || `${type}_${Date.now()}.${extensions[type]}`;

    const blob = new Blob([content], { type: mimeTypes[type] });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDownloadZip = async (files: string[], type: string) => {
    const zip = new JSZip();

    const typeLabels: Record<string, string> = {
      photo: "imagens",
      file: "documentos",
      audio: "audios",
    };

    files.forEach((filename) => {
      const content = getMockFileContent(filename, type);
      zip.file(filename, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${typeLabels[type] || "anexos"}_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Image className="h-4 w-4" />;
      case "file":
        return <FileText className="h-4 w-4" />;
      case "audio":
        return <Mic className="h-4 w-4" />;
      case "map":
        return <MapPin className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFileTypeLabel = (type: string, isPlural: boolean = false) => {
    if (isPlural) {
      switch (type) {
        case "photo":
          return "Imagens";
        case "file":
          return "Documentos";
        case "audio":
          return "Áudios";
        default:
          return "Anexos";
      }
    }
    switch (type) {
      case "photo":
        return "Imagem";
      case "file":
        return "Documento";
      case "audio":
        return "Áudio";
      case "map":
        return "Localização";
      default:
        return "Arquivo";
    }
  };

  const getDisplayValue = () => {
    if (answer === null || answer === undefined || answer === "") {
      return <span className="text-muted-foreground italic">Sem resposta</span>;
    }

    if (
      question.type === "photo" ||
      question.type === "file" ||
      question.type === "audio" ||
      question.type === "map"
    ) {
      if (Array.isArray(answer) && answer.length > 0) {
        const isMultiple = answer.length > 1;
        const displayText = answer.join(", ");

        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {getFileIcon(question.type)}
              <span className="text-sm flex-1" title={displayText}>
                {answer.length}{" "}
                {getFileTypeLabel(question.type, isMultiple).toLowerCase()}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
              {answer.map((file: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {file}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (isMultiple) {
                  handleDownloadZip(answer, question.type);
                } else {
                  handleDownload(answer[0], question.type);
                }
              }}
              className="h-7 gap-1.5 text-xs w-fit"
            >
              <Download className="h-3 w-3" />
              {isMultiple
                ? `Baixar ${getFileTypeLabel(question.type, true)} (.zip)`
                : `Baixar ${getFileTypeLabel(question.type)}`}
            </Button>
          </div>
        );
      }

      const displayText =
        question.type === "map"
          ? answer.replace("lat:", "Lat: ").replace(",lng:", " | Lng: ")
          : answer;

      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {getFileIcon(question.type)}
            <span className="text-sm flex-1" title={displayText}>
              {displayText}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(answer, question.type);
            }}
            className="h-7 gap-1.5 text-xs w-fit"
          >
            <Download className="h-3 w-3" />
            Baixar {getFileTypeLabel(question.type)}
          </Button>
        </div>
      );
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
          <div className="text-sm flex-1">{getDisplayValue()}</div>
          {question.type !== "photo" &&
            question.type !== "file" &&
            question.type !== "audio" &&
            question.type !== "map" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Editar resposta</span>
              </Button>
            )}
        </div>
      )}
    </div>
  );
}
