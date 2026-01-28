import { createFileRoute } from "@tanstack/react-router";
import ProjectLogs from "@/features/projects/logs";
import { ProjectsProvider } from "@/features/projects/components/projects-provider";

export const Route = createFileRoute("/_authenticated/projects/logs")({
  component: () => (
    <ProjectsProvider>
      <ProjectLogs />
    </ProjectsProvider>
  ),
});
