import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Passivo, RiscoNivel } from "../data/schema";
import { User } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DataTableRowActions } from "./data-table-row-actions";

const riscoMap: Record<RiscoNivel, string> = {
  Baixo: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Médio: "bg-amber-100 text-amber-800 border-amber-200",
  Alto: "bg-orange-100 text-orange-800 border-orange-200",
  Crítico: "bg-red-100 text-red-800 border-red-300 font-bold animate-pulse",
};

export function categorizarDiasAberto(dias: number) {
  if (dias <= 30) return '0' //'Até 30 dias'
  if (dias <= 90) return '1' //'31-90 dias'
  if (dias <= 180) return '2' //'91-180 dias'
  return '3' //'+180 dias'
}

export const columns: ColumnDef<Passivo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
    <Checkbox
        checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
    />
    ),
    meta: { className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
    cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value: any) => row.toggleSelected(!!value)}
      aria-label='Select row'
      className='translate-y-[2px]'
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
      <div className="flex flex-col gap-x-2">
        <span className="font-medium text-slate-900">{row.original.nome}</span>
        <span className="text-xs text-slate-500">{row.original.categoria}</span>
      </div>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
  },
  {
    accessorKey: "risco",
    header: "Risco",
    // header: ({ column }) => (
    //   <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //     Risco <ArrowUpDown className="ml-2 h-3 w-3" />
    //   </Button>
    // ),
    cell: ({ row }) => <Badge variant="outline" className={riscoMap[row.original.risco]}>{row.original.risco}</Badge>,
    
  },
  {
    id: "impacto",
    header: "Impacto (A/S)",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className={`h-3 w-3 rounded-full ${row.original.impactoAmbiental === 'Severo' ? 'bg-red-500' : 'bg-slate-300'}`} />
            </TooltipTrigger>
            <TooltipContent>Ambiental: {row.original.impactoAmbiental}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className={`h-3 w-3 rounded-full ${row.original.impactoSocial === 'Severo' ? 'bg-blue-500' : 'bg-slate-300'}`} />
            </TooltipTrigger>
            <TooltipContent>Social: {row.original.impactoSocial}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  },
  {
    accessorKey: "statusPlano",
    header: "Plano de Ação",
    cell: ({ row }) => {
      const status = row.original.statusPlano;
      return (
        <Badge variant="secondary" className={status === 'Atrasado' ? 'text-red-600 bg-red-50' : ''}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: "diasAberto",
    header: "Dias Aberto",
    cell: ({ row }) => differenceInDays(new Date(), parseISO(row.original.dataIdentificacao))
  },
  {
    id: 'diasAbertoCategoria',
    accessorFn: (row) => {
      const dias = differenceInDays(
        new Date(),
        parseISO(row.dataIdentificacao)
      )

      return categorizarDiasAberto(dias)
    },
    filterFn: 'arrIncludes',
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "responsavel",
    header: "Responsável",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs">
        <User className="h-3 w-3 text-slate-400" /> {row.original.responsavel}
      </div>
    )
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  }
];