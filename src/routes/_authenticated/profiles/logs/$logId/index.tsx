import { createFileRoute } from "@tanstack/react-router";
import ViewProfileLog from "@/features/profiles/logs/view";
import { ProfilesProvider } from "@/features/profiles/components/profiles-provider";

export const Route = createFileRoute("/_authenticated/profiles/logs/$logId/")({
  component: () => {
    const { logId } = Route.useParams();
    return (
      <ProfilesProvider>
        <ViewProfileLog logId={logId} />
      </ProfilesProvider>
    );
  },
});
