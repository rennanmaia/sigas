import { createFileRoute } from "@tanstack/react-router";
import FormLogs from "@/features/forms/logs";

export const Route = createFileRoute("/_authenticated/forms/logs/")({
  component: FormLogs,
});
