import { createFileRoute } from "@tanstack/react-router";
import { FormsProvider } from "@/features/forms/components/forms-provider";
import ViewFormLog from "@/features/forms/logs/view";

export const Route = createFileRoute("/_authenticated/forms/logs/$logId/")({
  component: () => {
    const { logId } = Route.useParams();
    return (
      <FormsProvider>
        <ViewFormLog logId={logId} />
      </FormsProvider>
    );
  },
});
