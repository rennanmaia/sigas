import { createFileRoute } from "@tanstack/react-router";
import { Passives } from "@/features/passives";
import z from "zod";

export enum LiabilityView {
  OVERVIEW = "overview",
  LIST = "list",
  CRITICAL = "critical",
  RESOLVE = "resolve",
}

export const LiabilityTabs = [
  LiabilityView.OVERVIEW,
  LiabilityView.LIST,
] as const;


export const LiabilityViews = Object.values(LiabilityView) as readonly LiabilityView[];


const LiabilitySearchSchema = z.object({
  tabs: z.enum(LiabilityTabs).catch(LiabilityView.OVERVIEW).default(LiabilityView.OVERVIEW),
  view: z.enum(LiabilityViews).catch(LiabilityView.OVERVIEW).default(LiabilityView.OVERVIEW),
  selectedId: z.string().optional(),
  q: z.string().optional(),
})

export type LiabilitySearch = z.infer<typeof LiabilitySearchSchema>

export const Route = createFileRoute("/_authenticated/passives/")({
  validateSearch: (search) => LiabilitySearchSchema.parse(search),
  component: Passives,
});
