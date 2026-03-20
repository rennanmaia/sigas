import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import { useForms } from "./forms-provider";
import { useFormsStore } from "@/stores/forms-store";
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
  const { deleteForms } = useForms();
  const { addLog } = useFormsStore();

  const config: DeleteDialogConfig = {
    mode: "single",
    item: {
      id: currentRow.id,
      label: currentRow.title,
    },
    namespace: "forms",
    confirmStrategy: "typed",
    onDelete: (id) => {
      const questionCount = currentRow.questions?.length || 0;
      deleteForms([id as string]);
      addLog("exclusão", id as string, currentRow.title, `Formulário "${currentRow.title}" foi excluído (contendo ${questionCount} pergunta(s)).`);
      toast.success(`Form "${currentRow.title}" deleted successfully`);
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
