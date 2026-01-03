import { Projects } from "@/features/projects";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
const projectsSearchSchema = z.object({
  filter: z.string().optional().catch(""),
  type: z.enum(["all", "concluido", "emAndamento"]).optional().catch("all"),
  sort: z.enum(["asc", "desc"]).optional().catch("asc"),
});
export const Route = createFileRoute("/_authenticated/projects/")({
  validateSearch: (search) => projectsSearchSchema.parse(search),
  component: Projects,
});
