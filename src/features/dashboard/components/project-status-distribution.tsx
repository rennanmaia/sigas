import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/features/projects/data/projects-mock";

const statusConfig: Record<
  string,
  { label: string; color: string; badgeClass: string }
> = {
  active: {
    label: "Ativo",
    color: "bg-green-500",
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  paused: {
    label: "Pausado",
    color: "bg-yellow-500",
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  finished: {
    label: "Concluído",
    color: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  canceled: {
    label: "Cancelado",
    color: "bg-red-500",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  expired: {
    label: "Expirado",
    color: "bg-gray-500",
    badgeClass: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

export function ProjectStatusDistribution() {
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    }

    const total = projects.length;
    return Object.entries(counts)
      .map(([status, count]) => {
        const config = statusConfig[status] || {
          label: status,
          color: "bg-gray-500",
          badgeClass: "",
        };
        return {
          name: config.label,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          color: config.color,
          badgeClass: config.badgeClass,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [projects]);
  return (
    <div className="space-y-4">
      {statusData.map((status) => (
        <div key={status.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("text-xs", status.badgeClass)}
              >
                {status.name}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{status.count}</span>
              <span className="text-muted-foreground text-xs">
                ({status.percentage}%)
              </span>
            </div>
          </div>
          <div className="bg-muted h-2 w-full rounded-full">
            <div
              className={cn("h-2 rounded-full", status.color)}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </div>
      ))}

      {/* Totalizador */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total de Projetos</span>
          <span className="text-lg font-bold">
            {statusData.reduce((acc, s) => acc + s.count, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
