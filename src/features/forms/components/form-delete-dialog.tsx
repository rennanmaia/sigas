import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useForms } from "./forms-provider";
import type { FormItem } from "../data/forms-mock";

type FormDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: FormItem;
};

export function FormDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: FormDeleteDialogProps) {
  const [value, setValue] = useState("");
  const { deleteForms } = useForms();
  const handleDelete = () => {
    if (value.trim() !== currentRow.title.trim()) return;

    deleteForms([currentRow.id]);

    onOpenChange(false);
    setValue("");
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.title.trim()}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive me-1 inline-block"
            size={18}
          />{" "}
          Deletar Formulário
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Você tem certeza que quer deletar o formulário{" "}
            <span className="font-bold text-foreground">
              {currentRow.title}
            </span>
            ?
            <br />
            Esta ação removerá permanentemente o formulário e todos os seus
            dados. Digite o nome do formulário para confirmar.
          </p>

          <Label className="my-2">
            Palavra de confirmação:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Digite o título do formulário para confirmar."
              className="mt-2"
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
      confirmText="Deletar"
      destructive
    />
  );
}
