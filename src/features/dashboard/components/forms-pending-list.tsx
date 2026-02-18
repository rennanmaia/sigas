import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { forms } from "@/features/forms/data/forms-mock";
import { projects } from "@/features/projects/data/projects-mock";

const statusConfig = {
  Ativo: {
    label: "Ativo",
    class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  Rascunho: {
    label: "Rascunho",
    class:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
} as const;

export function FormsPendingList() {
  const pendingForms = useMemo(() => {
    return forms
      .filter((f) => f.status === "Rascunho" || f.status === "Ativo")
      .map((f) => {
        const project = projects.find((p) => p.id === f.projectId);
        const updated = new Date(f.lastUpdated);
        const now = new Date();
        const diffDays = Math.ceil(
          (updated.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        return {
          id: f.id,
          title: f.title,
          project: project ? project.title : "Sem projeto",
          assignee: f.owner,
          status: f.status as keyof typeof statusConfig,
          daysRemaining: diffDays,
        };
      })
      .slice(0, 5);
  }, [forms, projects]);

  return (
    <div className="space-y-4">
      {pendingForms.map((form) => (
        <div
          key={form.id}
          className="flex items-start justify-between gap-3 rounded-md border p-3"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-mono">
                {form.id}
              </span>
              <Badge
                variant="outline"
                className={cn("text-xs", statusConfig[form.status].class)}
              >
                {statusConfig[form.status].label}
              </Badge>
            </div>
            <p className="truncate text-sm font-medium">{form.title}</p>
            <p className="text-muted-foreground text-xs">
              {form.project} • {form.assignee}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-xs">
              {form.daysRemaining < 0
                ? `${Math.abs(form.daysRemaining)}d atrás`
                : `${form.daysRemaining}d restantes`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
