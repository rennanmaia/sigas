import { createFileRoute } from "@tanstack/react-router";
import CreateForm from "@/features/forms/create";
import { z } from "zod";

const createFormSearchSchema = z.object({
  projectId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/forms/create/")({
  component: CreateForm,
  validateSearch: createFormSearchSchema,
});
