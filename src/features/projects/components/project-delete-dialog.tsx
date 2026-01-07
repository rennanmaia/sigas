import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useProjects } from "./projects-provider";
import { useNavigate } from "@tanstack/react-router";
type ProjectDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: { id: string; title: string };
};

export function ProjectsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProjectDeleteDialogProps) {
  const [value, setValue] = useState("");
  const { deleteProject } = useProjects();
  const navigate = useNavigate();
  const handleDelete = () => {
    if (value.trim() !== currentRow.title) return;

    deleteProject(currentRow.id);
    onOpenChange(false);
    toast.success(`Projeto "${currentRow.title}" excluído com sucesso.`);
    setValue("");
    navigate({ to: "/projects" });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.title}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive me-1 inline-block"
            size={18}
          />{" "}
          Excluir Projeto
        </span>
      }
      desc={
        <div className="space-y-4 text-start">
          <p className="mb-2">
            Tem certeza que deseja excluir o projeto{" "}
            <span className="font-bold">{currentRow.title}</span>?
            <br />
            Esta ação removerá permanentemente todos os dados vinculados a este
            projeto.
          </p>

          <Label className="my-2">
            Título do projeto:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Digite o título exato para confirmar."
              className="mt-1"
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Esta operação não pode ser desfeita.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Excluir"
      destructive
    />
  );
}
