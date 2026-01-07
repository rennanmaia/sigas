import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetails } from "@/features/projects/view";
import { ProjectsProvider } from "@/features/projects/components/projects-provider";

export const Route = createFileRoute("/_authenticated/projects/$projectId/")({
  component: () => (
    <ProjectsProvider>
      <ProjectDetails />
    </ProjectsProvider>
  ),
});
