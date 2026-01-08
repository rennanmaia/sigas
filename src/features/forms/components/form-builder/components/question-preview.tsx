import { Camera, MapPin, Mic, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OptionsBuilder } from "./options-builder";
import type { Question } from "../types/question";

interface QuestionPreviewProps {
  question: Question;
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, idx: number, val: string) => void;
  onRemoveOption: (id: string, idx: number) => void;
}

export function QuestionPreview({ question, ...props }: QuestionPreviewProps) {
  if (question.type === "select" || question.type === "checkbox") {
    return (
      <OptionsBuilder
        questionId={question.id}
        options={question.options || []}
        type={question.type}
        {...props}
      />
    );
  }

  const renders: Record<string, React.ReactNode> = {
    text: (
      <Input
        disabled
        placeholder="Resposta curta..."
        className="bg-slate-50 border-dashed border-slate-200"
      />
    ),
    textarea: (
      <Textarea
        disabled
        placeholder="Resposta longa..."
        className="bg-slate-50 border-dashed border-slate-200 resize-none min-h-[80px]"
      />
    ),
    number: (
      <Input
        disabled
        type="number"
        placeholder="0"
        className="bg-slate-50 border-dashed border-slate-200 w-32"
      />
    ),
    date: (
      <Input
        disabled
        type="date"
        className="bg-slate-50 border-dashed border-slate-200 w-fit opacity-60"
      />
    ),

    map: (
      <div className="flex w-full max-w-sm items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <MapPin size={20} className="text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-600 tracking-tight">
            Localização GPS
          </span>
          <span className="text-[10px] text-slate-400">
            Marcar coordenadas no mapa
          </span>
        </div>
      </div>
    ),

    photo: (
      <div className="flex w-fit items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <Camera size={20} className="text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-600 tracking-tight">
            Capturar Imagem
          </span>
          <span className="text-[10px] text-slate-400">
            Usar câmera ou galeria
          </span>
        </div>
      </div>
    ),

    file: (
      <div className="flex w-full max-w-sm items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <UploadCloud size={20} className="text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-600 tracking-tight">
            Upload de arquivo
          </span>
          <span className="text-[10px] text-slate-400">
            Clique para selecionar documento
          </span>
        </div>
      </div>
    ),

    audio: (
      <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-slate-200 bg-slate-50 p-1.5 pr-5 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 text-white shadow-sm">
          <Mic size={18} />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex items-end gap-[2px] opacity-20">
            {[3, 5, 4, 7, 3, 6, 8, 5, 4, 6, 5, 3].map((h, i) => (
              <div
                key={i}
                className="w-[2px] bg-slate-900 rounded-full"
                style={{ height: `${h * 1.5}px` }}
              />
            ))}
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 tracking-tighter">
          00:00
        </span>
      </div>
    ),
  };

  return (
    <div className="pl-9 pr-4">{renders[question.type] || renders.text}</div>
  );
}
