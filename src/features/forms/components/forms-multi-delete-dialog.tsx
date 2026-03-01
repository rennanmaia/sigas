import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import { useForms } from "./forms-provider";

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

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const config: DeleteDialogConfig = {
    mode: "multi",
    table,
    namespace: "forms",
    confirmStrategy: "keyword",
    onDelete: (ids) => {
      const idArray = Array.isArray(ids) ? ids : [ids];
      deleteForms(idArray);
      toast.success(
        `${selectedRows.length} form(s) deleted successfully`
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
