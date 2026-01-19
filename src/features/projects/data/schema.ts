import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.enum(["Ambiental", "Social"]),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
  responsible: z.string().min(1, "Responsável é obrigatório"),
  budget: z.coerce.number().min(0, "O orçamento deve ser positivo"),
  forms: z.array(z.string()).default([]),
  members: z.array(z.string()).default([]),
  company: z.string().min(1, "A empresa responsável é obrigatória"),
  customFields: z
    .array(
      z.object({
        label: z.string().min(1, "O título é obrigatório"),
        value: z.string().min(1, "O valor é obrigatório"),
      }),
    )
    .optional()
    .default([]),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;
