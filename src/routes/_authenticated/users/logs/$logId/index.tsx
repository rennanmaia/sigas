import { createFileRoute } from "@tanstack/react-router";
import ViewUserLog from "@/features/users/logs/view";

export const Route = createFileRoute("/_authenticated/users/logs/$logId/")({
  component: () => {
    const { logId } = Route.useParams();
    return <ViewUserLog logId={logId} />;
  },
});
