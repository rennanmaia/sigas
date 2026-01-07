import { createFileRoute } from "@tanstack/react-router";
import CreateProject from "@/features/projects/create";
import { ProjectsProvider } from "@/features/projects/components/projects-provider";

export const Route = createFileRoute("/_authenticated/projects/create")({
  component: () => (
    <ProjectsProvider>
      <CreateProject />
    </ProjectsProvider>
  ),
});
