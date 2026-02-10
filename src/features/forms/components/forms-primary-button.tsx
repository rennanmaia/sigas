import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export function FormsPrimaryButtons() {
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" asChild>
        <Link to="/forms/create">
          <span>Criar Formulário</span> <FileText size={18} />
        </Link>
      </Button>
    </div>
  );
}
