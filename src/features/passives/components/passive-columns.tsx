import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Liability } from "../data/schema";
import { User } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DataTableRowActions } from "./data-table-row-actions";
import { Link } from "@tanstack/react-router";

const statusVariantMap: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Inativo: "bg-gray-100 text-gray-600 border-gray-200",
  Indisponível: "bg-amber-100 text-amber-800 border-amber-200",
};

export function categorizarDiasAberto(dias: number) {
  if (dias <= 30) return "0";
  if (dias <= 90) return "1";
  if (dias <= 180) return "2";
  return "3";
}

export const columns: ColumnDef<Liability>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: { className: cn("max-md:sticky start-0 z-10 rounded-tl-[inherit]") },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome",
    header: "Passivo",
    cell: ({ row }) => (
      <Link
        to="/passives/$passiveId"
        params={{ passiveId: row.original.id ?? "" }}
        className="font-medium truncate hover:underline"
      >
        <div className="flex flex-col gap-x-2">
          <span className="font-medium">{row.original.nome}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.categoria}
          </span>
        </div>
      </Link>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none",
      ),
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={statusVariantMap[row.original.status] ?? ""}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tipo;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "diasAberto",
    header: "Dias Aberto",
    cell: ({ row }) =>
      differenceInDays(new Date(), parseISO(row.original.dataIdentificacao)),
  },
  {
    id: "diasAbertoCategoria",
    accessorFn: (row) => {
      const dias = differenceInDays(
        new Date(),
        parseISO(row.dataIdentificacao),
      );

      return categorizarDiasAberto(dias);
    },
    filterFn: "arrIncludes",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "responsavel",
    header: "Criado por",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs">
        <User className="h-3 w-3 text-slate-400" />{" "}
        {row.original.responsavel || "—"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
