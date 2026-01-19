import { createFileRoute } from "@tanstack/react-router"
import CreateForm from "@/features/forms/create";

export const Route = createFileRoute("/_authenticated/forms/create/")({
  component: CreateForm,
});
