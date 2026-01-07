import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import ProjectForm from "../components/project-form";
import { useProjects } from "../components/projects-provider";
import { projects as mockProjects, projectTeam } from "../data/projects-mock";
import type { ProjectForm as ProjectFormValues } from "../data/schema";

export default function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams({
    from: "/_authenticated/projects/$projectId/edit",
  });
  const { projects, setProjects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return <div>Projeto não encontrado</div>;
  const onUpdate = (values: ProjectFormValues) => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);

    if (projectIndex !== -1) {
      const newManager = projectTeam.find((m) => m.name === values.responsible);

      const onlyOperationalMembers = (project.members || []).filter(
        (memberId) => {
          const memberObj = projectTeam.find((m) => m.id === memberId);
          return !memberObj?.role.toLowerCase().includes("gerente");
        }
      );

      const updatedMembers = newManager
        ? [newManager.id, ...onlyOperationalMembers]
        : onlyOperationalMembers;

      const updatedProject = {
        ...mockProjects[projectIndex],
        ...values,
        members: updatedMembers,
        stats: {
          ...mockProjects[projectIndex].stats,
          formsCount: values.forms?.length || 0,
          collectorsCount: updatedMembers.length,
        },
      };

      mockProjects[projectIndex] = updatedProject;
      setProjects([...mockProjects]);

      toast.success("Projeto atualizado com sucesso!");
      navigate({
        to: "/projects/$projectId",
        params: { projectId: projectId },
      });
    }
  };

  return (
    <>
      <Header fixed>
        <h1 className="text-sm font-medium">Editar Projeto</h1>
      </Header>
      <Main>
        <Card>
          <CardHeader>
            <CardTitle>Editar: {project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              submitLabel="Salvar Alterações"
              initialData={project}
              onSubmit={onUpdate}
            />
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
