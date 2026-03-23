import { createFileRoute } from "@tanstack/react-router";
import UserLogs from "@/features/users/logs";

export const Route = createFileRoute("/_authenticated/users/logs/")({
  component: UserLogs,
});