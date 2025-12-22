import { Forms } from "@/features/forms";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/forms/")({
  component: Forms,
});
