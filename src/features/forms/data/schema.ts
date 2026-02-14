import { z } from "zod";
import { t as i18next } from "i18next";

const optionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, i18next("forms:create.form_builder.form.questions.options.label.validation.required")),
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
    label: z.string().min(1, i18next("forms:create.form_builder.form.questions.label.validation.required")),
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
      message: i18next("forms:create.form_builder.form.questions.options.validation.minLength"),
      path: ["options"],
    },
  );

export const createFormSchema = z.object({
  title: z
    .string()
    .min(3, i18next("forms:create.form_builder.form.title.validation.minLength"))
    .max(100, i18next("forms:create.form_builder.form.title.validation.maxLength")),
  description: z
    .string()
    .min(5, i18next("forms:create.form_builder.form.description.validation.minLength")),
  status: z
    .enum(["Ativo", "Rascunho", "Arquivado", "Concluído"])
    .default("Rascunho"),
  owner: z.string(),
  projectId: z.string(),
  questions: z
    .array(questionSchema)
    .min(1, i18next("forms:create.form_builder.form.questions.validation.minLength")),
});

export type CreateFormValues = z.infer<typeof createFormSchema>;
