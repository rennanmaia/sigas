import { createFileRoute } from "@tanstack/react-router";
import Audit from "@/features/audit";

export const Route = createFileRoute("/_authenticated/audit/")({
  component: Audit,
  validateSearch: (search: Record<string, unknown>) => ({
    filter: (search.filter as string) || undefined,
  }),
});