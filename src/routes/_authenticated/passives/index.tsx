import { createFileRoute } from "@tanstack/react-router";
import { Passives } from "@/features/passives";

export const Route = createFileRoute("/_authenticated/passives/")({
  component: Passives,
});
