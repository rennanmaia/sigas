import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function FormsPrimaryButtons() {
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => {}}>
        <span>Criar Formulário</span> <FileText size={18} />
      </Button>
    </div>
  );
}
