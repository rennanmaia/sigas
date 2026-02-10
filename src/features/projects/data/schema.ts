import { z } from "zod";
import { t as i18next } from "i18next";

export const projectFormSchema = z.object({
  title: z.string().min(1, i18next("projects:create.form.title.validation.required")),
  description: z.string().min(1, i18next("projects:create.form.description.validation.required")),
  category: z.enum(["Ambiental", "Social"]),
  startDate: z.string().min(1, i18next("projects:create.form.startDate.validation.required")),
  endDate: z.string().min(1, i18next("projects:create.form.endDate.validation.required")),
  responsible: z.string().min(1, i18next("projects:create.form.responsible.validation.required")),
  budget: z.coerce.number().min(0, i18next("projects:create.form.budget.validation.positive")),
  forms: z.array(z.string()).default([]),
  members: z.array(z.string()).default([]),
  company: z.string().min(1, i18next("projects:create.form.company.validation.required")),
  customFields: z
    .array(
      z.object({
        label: z.string().min(1, i18next("projects:create.form.customFields.label.validation.required")),
        value: z.string().min(1, i18next("projects:create.form.customFields.value.validation.required")),
      }),
    )
    .optional()
    .default([]),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;
