import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { Pen, Trash2, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useForms } from "./forms-provider";

type DataTableRowActionsProps = {
  row: Row<any>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentForm, duplicateForm } = useForms();

  return (
    <div className="z-100">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem>
            <Link to={`/forms/edit/$id`} params={{ id: row.original.id }}>
              <span className="no-underline flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={"/forms/edit/$id"} params={{ id: row.original.id }}>
              <span className="no-underline flex items-center">
                <Pen className="mr-2 h-4 w-4" />
                Editar
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              duplicateForm(row.original.id);
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentForm(row.original);
              setOpen("delete");
            }}
            className="text-red-500!"
          >
            Deletar
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
