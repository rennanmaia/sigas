import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionType } from "../types/question";

interface QuestionTypeSelectProps {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}

export function QuestionTypeSelect({
  value,
  onChange,
}: QuestionTypeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as QuestionType)}>
      <SelectTrigger className="w-full sm:w-[160px] h-9 bg-background/50 border-muted-foreground/20">
        <SelectValue placeholder="Tipo de questão" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="text">Texto Curto</SelectItem>
        <SelectItem value="textarea">Texto Longo</SelectItem>
        <SelectItem value="number">Número</SelectItem>
        <SelectItem value="date">Data</SelectItem>
        <SelectItem value="select">Seleção Única</SelectItem>
        <SelectItem value="checkbox">Múltipla Escolha</SelectItem>
        <SelectItem value="photo">Imagem</SelectItem>
        <SelectItem value="map">Localização</SelectItem>
        <SelectItem value="file">Arquivo</SelectItem>
        <SelectItem value="audio">Áudio</SelectItem>
      </SelectContent>
    </Select>
  );
}
