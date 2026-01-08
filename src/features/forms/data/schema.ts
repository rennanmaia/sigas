import { z } from "zod";

export const createFormSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100),
  description: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 caracteres"),
  status: z
    .enum(["Ativo", "Rascunho", "Arquivado", "Concluído"])
    .default("Rascunho"),
  owner: z.string().min(1, "Defina um proprietário responsável"),
});

export type CreateFormValues = z.infer<typeof createFormSchema>;
