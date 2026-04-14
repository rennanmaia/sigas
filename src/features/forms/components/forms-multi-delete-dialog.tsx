import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  DeleteDialog,
  type DeleteDialogConfig,
} from "@/components/delete-dialog";
import { useForms } from "./forms-provider";
import { useFormsStore } from "@/stores/forms-store";
import type { Section } from "./form-builder/types/question";

type DeletedFormData = {
  id: string;
  title: string;
  sections: Section[];
};

type FormsMultiDeleteDialogProps<TData> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<TData>;
};

export function FormsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: FormsMultiDeleteDialogProps<TData>) {
  const { deleteForms } = useForms();
  const { addLog } = useFormsStore();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const config: DeleteDialogConfig = {
    mode: "multi",
    table,
    namespace: "forms",
    confirmStrategy: "keyword",
    onDelete: (ids) => {
      const idArray = (Array.isArray(ids) ? ids : [ids]) as string[];
      deleteForms(idArray);
      idArray.forEach((fid) => {
        const row = selectedRows.find(
          (r) => (r.original as DeletedFormData).id === fid,
        );
        const title = row ? (row.original as DeletedFormData).title : "";
        const questionCount = row
          ? (row.original as DeletedFormData).sections.reduce(
              (acc, s) => acc + s.questions.length,
              0,
            )
          : 0;
        addLog(
          "exclusão",
          fid,
          title,
          `Formulário "${title}" foi excluído (contendo ${questionCount} pergunta(s)).`,
        );
      });
      toast.success(
        `${selectedRows.length} formulário(s) deletado(s) com sucesso`,
      );
    },
    onBeforeClose: () => {
      table.resetRowSelection();
    },
  };

  return (
    <DeleteDialog open={open} onOpenChange={onOpenChange} config={config} />
  );
}
