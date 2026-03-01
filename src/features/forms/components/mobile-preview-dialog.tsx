import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, Mic, UploadCloud, Plus, X } from "lucide-react";
import type { Question } from "./form-builder/types/question";

interface MobilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  questions: Question[];
}

export function MobilePreviewDialog({
  open,
  onOpenChange,
  title,
  description,
  questions,
}: MobilePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 pt-4 pb-3 border-b bg-muted/30">
          <DialogTitle className="text-sm font-medium text-muted-foreground">
            Pré-visualização do Formulário
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center p-4 bg-muted">
          <div className="relative w-full max-w-[375px] h-full bg-background">
            <div className="light absolute inset-2 rounded-3xl text-foreground overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div className="space-y-2 pb-4 border-b-4 border-b-primary/20">
                    <h1 className="text-xl font-bold">
                      {title || "Título do Formulário"}
                    </h1>
                    {description && <p className="text-sm ">{description}</p>}
                  </div>

                  {questions.length > 0 ? (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <QuestionPreviewMobile
                          key={question.id}
                          question={question}
                          index={index}
                        />
                      ))}

                      <Button className="w-full" size="lg">
                        Enviar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-sm ">Nenhuma questão adicionada</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QuestionPreviewMobile({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; name: string; size: string }>
  >([]);
  const [markedLocation, setMarkedLocation] = useState<{
    lat: string;
    lng: string;
  } | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const handleAddFile = () => {
    const newFile = {
      id: Math.random().toString(36).substring(7),
      name: `documento-exemplo-${uploadedFiles.length + 1}.pdf`,
      size: "125 KB",
    };
    setUploadedFiles([...uploadedFiles, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const handleMarkLocation = () => {
    setMarkedLocation({
      lat: "-2.5194",
      lng: "-54.7082",
    });
  };

  const handleRemoveLocation = () => {
    setMarkedLocation(null);
  };

  const handleCapturePhoto = () => {
    const newPhoto = {
      id: Math.random().toString(36).substring(7),
      name: `foto-${capturedPhotos.length + 1}.jpg`,
    };
    setCapturedPhotos([...capturedPhotos, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setCapturedPhotos(capturedPhotos.filter((photo) => photo.id !== id));
  };

  const maskPreviews: Record<string, string> = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
    phone: "(00) 00000-0000",
    cep: "00000-000",
    plate: "ABC-1234 ou ABC1D23",
  };

  const dynamicPlaceholder = question.validations?.mask
    ? maskPreviews[question.validations.mask]
    : "Digite sua resposta...";

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input placeholder={dynamicPlaceholder} className="w-full" disabled />
        );

      case "textarea":
        return (
          <Textarea
            placeholder="Digite uma resposta mais detalhada..."
            className="w-full min-h-[100px] resize-none"
            disabled
          />
        );

      case "number":
        return (
          <Input type="number" placeholder="0" className="w-full" disabled />
        );

      case "date":
        return <Input type="date" className="w-full" disabled />;

      case "select":
        return (
          <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
            <div className="space-y-3">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.id}
                    id={`${question.id}-${option.id}`}
                  />
                  <Label
                    htmlFor={`${question.id}-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.id}`}
                  checked={checkedValues.includes(option.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCheckedValues([...checkedValues, option.id]);
                    } else {
                      setCheckedValues(
                        checkedValues.filter((v) => v !== option.id),
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`${question.id}-${option.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "photo":
        return (
          <div className="space-y-3">
            {capturedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 p-3 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                  <Camera size={18} className="text-blue-600" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-600 truncate">
                    {photo.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Imagem capturada
                  </span>
                </div>
                <button
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remover foto"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={handleCapturePhoto}
              className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera size={16} />
              </div>
              <span className="text-xs font-medium text-primary">
                {capturedPhotos.length > 0
                  ? "Capturar outra imagem"
                  : "Capturar imagem"}
              </span>
            </button>
          </div>
        );

      case "map":
        return (
          <div className="space-y-3">
            {markedLocation ? (
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 p-3 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                  <MapPin size={18} className="text-green-600" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-600">
                    Localização marcada
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {markedLocation.lat}, {markedLocation.lng}
                  </span>
                </div>
                <button
                  onClick={handleRemoveLocation}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remover localização"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleMarkLocation}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin size={16} />
                </div>
                <span className="text-xs font-medium text-primary">
                  Marcar localização
                </span>
              </button>
            )}
          </div>
        );

      case "file":
        return (
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 p-3 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                  <UploadCloud size={18} className="text-slate-400" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-600 truncate">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {file.size}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remover arquivo"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddFile}
              className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Plus size={16} />
              </div>
              <span className="text-xs font-medium text-primary">
                {uploadedFiles.length > 0
                  ? "Adicionar outro arquivo"
                  : "Adicionar arquivo"}
              </span>
            </button>
          </div>
        );

      case "audio":
        return (
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 p-1.5 pr-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 text-white shadow-sm">
              <Mic size={16} />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <div className="flex items-end gap-0.5 opacity-20">
                {[3, 5, 4, 7, 3, 6, 8, 5, 4, 6, 5, 3].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-slate-900 rounded-full"
                    style={{ height: `${h * 1.5}px` }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">00:00</span>
          </div>
        );

      default:
        return (
          <Input placeholder={dynamicPlaceholder} className="w-full" disabled />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-1">
        <span className="text-muted-foreground">{index + 1}.</span>
        {question.label}
        {question.required && <span className="text-destructive">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
}