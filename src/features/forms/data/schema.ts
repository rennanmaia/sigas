import { z } from "zod";

const optionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "A opção não pode estar vazia"),
});

const validationSchema = z.object({
  min: z.union([z.number(), z.string()]).optional(),
  max: z.union([z.number(), z.string()]).optional(),
  mask: z.string().optional(),
});

const questionSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    label: z.string().min(1, "A pergunta não pode estar vazia"),
    required: z.boolean().default(false),
    options: z.array(optionSchema).optional(),
    validations: validationSchema.optional(),
    logic: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "select" || data.type === "checkbox") {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    {
      message: "Deve ter pelo menos 2 opções",
      path: ["options"],
    },
  );

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
  owner: z.string(),
  projectId: z.string(),
  questions: z
    .array(questionSchema)
    .min(1, "O formulário deve ter pelo menos uma pergunta"),
});

export type CreateFormValues = z.infer<typeof createFormSchema>;
