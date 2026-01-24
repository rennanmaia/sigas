import { createFileRoute } from "@tanstack/react-router";
import { Passives } from "@/features/passives";
import z from "zod";

export enum PassiveView {
  OVERVIEW = "overview",
  LIST = "list",
  CRITICAL = "critical",
  RESOLVE = "resolve",
}

export const PassiveTabs = [
  PassiveView.OVERVIEW,
  PassiveView.LIST,
] as const;


export const PassiveViews = Object.values(PassiveView) as readonly PassiveView[];


const passivesSearchSchema = z.object({
  tabs: z.enum(PassiveTabs).catch(PassiveView.OVERVIEW).default(PassiveView.OVERVIEW),
  view: z.enum(PassiveViews).catch(PassiveView.OVERVIEW).default(PassiveView.OVERVIEW),
  selectedId: z.string().optional(),
  q: z.string().optional(),
})

export type PassivesSearch = z.infer<typeof passivesSearchSchema>

export const Route = createFileRoute("/_authenticated/passives/")({
  validateSearch: (search) => passivesSearchSchema.parse(search),
  component: Passives,
});
