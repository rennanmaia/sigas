import { createFileRoute } from "@tanstack/react-router";
import EditProject from "@/features/projects/edit";
import { ProjectsProvider } from "@/features/projects/components/projects-provider";

export const Route = createFileRoute(
  "/_authenticated/projects/$projectId/edit"
)({
  component: () => (
    <ProjectsProvider>
      <EditProject />
    </ProjectsProvider>
  ),
});
