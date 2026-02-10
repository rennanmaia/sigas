import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import FormList from "@/features/forms";

const formsSearchSchema = z.object({
  title: z.string().optional(),
  status: z.array(z.string()).optional(),
  owner: z.string().optional(),

  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),

  filter: z.string().optional().catch(""),
  sort: z.enum(["asc", "desc"]).optional().catch("asc"),
});

export const Route = createFileRoute("/_authenticated/forms/")({
  validateSearch: (search) => formsSearchSchema.parse(search),
  component: () => {
    const search = Route.useSearch();

    const navigate = useNavigate({ from: Route.fullPath });

    return <FormList search={search} navigate={navigate as any} />;
  },
});
