import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import { useForms } from "./forms-provider";
import { useFormsStore } from "@/stores/forms-store";
import type { Question } from "./form-builder/types/question";

type FormsMultiDeleteDialogProps<
  TData extends { id: string; title: string; questions: Question[] },
> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<TData>;
};

export function FormsMultiDeleteDialog<
  TData extends { id: string; title: string; questions: Question[] },
>({ open, onOpenChange, table }: FormsMultiDeleteDialogProps<TData>) {
  const { deleteForms } = useForms();
  const { addLog } = useFormsStore();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const config: DeleteDialogConfig = {
    mode: "multi",
    table,
    namespace: "forms",
    confirmStrategy: "keyword",
    onDelete: (ids) => {
      const idArray = Array.isArray(ids) ? ids : [ids];
      deleteForms(idArray);
      idArray.forEach((fid) => {
        const row = selectedRows.find((r) => r.original.id === fid);
        const title = row ? row.original.title : "";
        const questionCount = row ? row.original.questions.length : 0;
        addLog(
          "exclusão",
          fid as string,
          title,
          `Formulário "${title}" foi excluído (contendo ${questionCount} pergunta(s)).`,
        );
      });
      toast.success(
        `${selectedRows.length} formulário(s) deletado(s) com successo`
      );
    },
    onBeforeClose: () => {
      table.resetRowSelection();
    },
  };

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      config={config}
    />
  );
}
