import { createFileRoute } from "@tanstack/react-router";
import ProfileLogs from "@/features/profiles/logs";

export const Route = createFileRoute("/_authenticated/profiles/logs")({
  component: ProfileLogs,
});