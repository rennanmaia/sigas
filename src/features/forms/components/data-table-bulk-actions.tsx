import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table";
import { FormsMultiDeleteDialog } from "./forms-multi-delete-dialog";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar table={table} entityName="forms">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Deletar Formulários selecionados"
              title="Deletar Formulário selecionados"
            >
              <Trash2 />
              <span className="sr-only">Deletar Formulário selecionado</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deletar Formulários selecionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <FormsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  );
}
