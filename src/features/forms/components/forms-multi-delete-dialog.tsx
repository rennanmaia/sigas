import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useForms } from "./forms-provider";

type FormsMultiDeleteDialogProps<TData> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<TData>;
};

const CONFIRM_WORD = "DELETE";

export function FormsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: FormsMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState("");
  const { deleteForms } = useForms();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) return;

    const idsToDelete = selectedRows.map((row: any) => row.original.id);

    deleteForms(idsToDelete);

    onOpenChange(false);
    table.resetRowSelection();
    setValue("");

    toast.success(
      `${idsToDelete.length} formulário(s) excluído(s) com sucesso.`,
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className="text-destructive flex items-center gap-2">
          <AlertTriangle size={18} />
          Apagar {selectedRows.length}{" "}
          {selectedRows.length > 1 ? "formulários" : "formulário"}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Tem a certeza que deseja apagar os formulários selecionados? <br />
            Esta ação não pode ser desfeita.
          </p>

          <Label className="flex flex-col gap-2">
            <span>Confirme digitando "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Digite ${CONFIRM_WORD}`}
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Esta operação é permanente e removerá todos os dados associados.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Apagar Tudo"
      destructive
    />
  );
}
