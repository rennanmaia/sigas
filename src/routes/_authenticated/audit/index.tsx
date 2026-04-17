import { createFileRoute } from "@tanstack/react-router";
import Audit from "@/features/audit";
import z from "zod";

const auditSearchSchema = z
  .object({
    filter: z
      .enum(["projects", "forms", "users", "profiles", "system"])
      .optional()
      .catch(undefined),
    mode: z.enum(["none", "month-year", "range"]).optional().catch("none"),
    month: z
      .string()
      .regex(/^(0[1-9]|1[0-2])$/)
      .optional()
      .catch(undefined),
    year: z.string().regex(/^\d{4}$/).optional().catch(undefined),
    from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .catch(undefined),
    to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .catch(undefined),
    eventId: z.string().optional().catch(undefined),
  })
  .superRefine((value, ctx) => {
    if (value.from && value.to && value.from > value.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date range: from must be before to",
        path: ["to"],
      });
    }
  });

export const Route = createFileRoute("/_authenticated/audit/")({
  component: Audit,
  validateSearch: (search) => auditSearchSchema.parse(search),
});