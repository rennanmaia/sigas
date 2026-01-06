import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import ProjectForm from "../components/project-form";
import { useProjects } from "../components/projects-provider";
import type { ProjectForm as ProjectFormValues } from "../data/schema";

export default function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams({
    from: "/_authenticated/projects/$projectId/edit",
  });
  const { projects, setProjects } = useProjects();

  const currentProject = projects.find((p) => p.id === projectId);

  if (!currentProject) {
    return (
      <Main>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
          <Link to="/projects" className="text-primary hover:underline mt-2">
            Voltar para a lista
          </Link>
        </div>
      </Main>
    );
  }

  const onUpdate = (values: ProjectFormValues) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              ...values,
              stats: {
                ...p.stats,
                formsCount: values.forms?.length || p.stats.formsCount,
                collectorsCount:
                  values.members?.length || p.stats.collectorsCount,
              },
            }
          : p
      )
    );

    toast.success("Projeto atualizado com sucesso!");
    navigate({
      to: "/projects/$projectId",
      params: { projectId: projectId },
    });
  };

  return (
    <>
      <Header fixed>
        <div className="flex items-center gap-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
        </div>
      </Header>

      <Main>
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Editar Projeto
            </h2>
            <p className="text-muted-foreground">
              Ajuste as informações e alocações do projeto:{" "}
              <span className="font-semibold">{currentProject.title}</span>
            </p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Dados do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm
                submitLabel="Salvar Alterações"
                initialData={currentProject}
                onSubmit={(values) => onUpdate(values)}
              />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
