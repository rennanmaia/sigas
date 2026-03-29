import { createFileRoute } from "@tanstack/react-router";
import ViewProjectLog from "@/features/projects/logs/view";
import { ProjectsProvider } from "@/features/projects/components/projects-provider";

export const Route = createFileRoute("/_authenticated/projects/logs/$logId/")({
  component: () => {
    const { logId } = Route.useParams();
    return (
      <ProjectsProvider>
        <ViewProjectLog logId={logId} />
      </ProjectsProvider>
    );
  },
});
