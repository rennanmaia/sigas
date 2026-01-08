import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, FileEdit, Trash2, Copy, Pen, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FormItem } from "../data/forms-mock";
import type { ColumnDef } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DataTableColumnHeader } from "@/components/data-table";

const statusStyles: Record<string, string> = {
  Ativo: "border-blue-200 bg-blue-50 text-blue-700",
  Concluído: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rascunho: "border-amber-200 bg-amber-50 text-amber-700",
  Arquivado: "border-slate-200 bg-slate-50 text-slate-600",
};

export const formsColumns: ColumnDef<FormItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[300px]">
        <Link
          to="/forms/$id/edit"
          params={{ id: row.original.id }}
          className="font-medium truncate hover:underline"
        >
          {row.getValue("title")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={statusStyles[status] || ""}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proprietário" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
          {String(row.getValue("owner"))
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <span className="text-sm">{row.getValue("owner")}</span>
      </div>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modificado" />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground ml-4">
        {row.getValue("lastUpdated")}
      </div>
    ),
  },
  {
    accessorKey: "questionsCount",
    header: () => <div className="text-center">Questões</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.getValue("questionsCount")}
      </div>
    ),
  },
  {
    accessorKey: "responses",
    header: () => <div className="text-center">Respostas</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">{row.getValue("responses")}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => (
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
          className="w-[160px]"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem>
            <Link to={`/forms/$id`} params={{ id: row.original.id }}>
              <span className="no-underline flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={"/forms/$id/edit"} params={{ id: row.original.id }}>
              <span className="no-underline flex items-center">
                <Pen className="mr-2 h-4 w-4" />
                Edit
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // setCurrentRow(row.original);
              // setOpen("delete");
            }}
            className="text-red-500!"
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
