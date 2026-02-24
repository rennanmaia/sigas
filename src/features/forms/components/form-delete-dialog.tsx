import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
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
  const { deleteForms } = useForms();

  const config: DeleteDialogConfig = {
    mode: "single",
    item: {
      id: currentRow.id,
      label: currentRow.title,
    },
    namespace: "forms",
    confirmStrategy: "typed",
    onDelete: (id) => {
      deleteForms([id as string]);
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
