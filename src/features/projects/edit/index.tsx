import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import ProjectForm from "../components/project-form";
import { useProjects } from "../components/projects-provider";
import { projectTeam } from "../data/projects-mock";
import type { ProjectForm as ProjectFormValues } from "../data/schema";

export default function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams({
    from: "/_authenticated/projects/$projectId/edit",
  });
  const { projects, setProjects, addLog } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return <div>Projeto não encontrado</div>;
  const onUpdate = (values: ProjectFormValues) => {
    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex !== -1) {
      const newManager = projectTeam.find((m) => m.name === values.responsible);

      const onlyOperationalMembers = (project.members || []).filter(
        (memberId) => {
          const memberObj = projectTeam.find((m) => m.id === memberId);
          return !memberObj?.role.toLowerCase().includes("gerente");
        },
      );

      const updatedMembers = newManager
        ? [newManager.id, ...onlyOperationalMembers]
        : onlyOperationalMembers;

      const updatedProject = {
        ...project,
        ...values,
        status: project.status,
        members: updatedMembers,
        stats: {
          ...project.stats,
          formsCount: values.forms?.length || 0,
          collectorsCount: updatedMembers.length,
        },
      };

      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = updatedProject;
      setProjects(updatedProjects);

      const changes: string[] = [];
      if (values.title !== project.title) {
        changes.push(`Título: "${project.title}" → "${values.title}"`);
      }
      if (values.description !== project.description) {
        changes.push(`Descrição alterada`);
      }
      if (values.responsible !== project.responsible) {
        changes.push(
          `Responsável: "${project.responsible}" → "${values.responsible}"`,
        );
      }
      if (values.category !== project.category) {
        changes.push(`Categoria: "${project.category}" → "${values.category}"`);
      }
      if (values.startDate !== project.startDate) {
        changes.push(
          `Data de Início: "${project.startDate}" → "${values.startDate}"`,
        );
      }
      if (values.endDate !== project.endDate) {
        changes.push(
          `Data de Término: "${project.endDate}" → "${values.endDate}"`,
        );
      }
      if (values.budget !== project.budget) {
        changes.push(`Orçamento: "${project.budget}" → "${values.budget}"`);
      }
      if (values.company !== project.company) {
        changes.push(`Empresa: "${project.company}" → "${values.company}"`);
      }

      const details = changes.length > 0 ? changes.join("\n") : undefined;
      addLog("edição", projectId, values.title, details, "João Silva");

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
