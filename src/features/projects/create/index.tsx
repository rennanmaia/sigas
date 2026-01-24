import { Bird, Users, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import ProjectForm from "../components/project-form";
import type { ProjectForm as ProjectFormValues } from "../data/schema";
import { projects as mockProjects, type Project } from "../data/projects-mock";
import { useProjects } from "../components/projects-provider";

export default function CreateProject() {
  const navigate = useNavigate();
  const { setProjects } = useProjects();

  const onCreate = (values: ProjectFormValues) => {
    const newProject: Project = {
      ...values,
      id: `proj-${Date.now()}`,
      title: values.title,
      description: values.description,
      category: values.category,
      startDate: values.startDate,
      endDate: values.endDate,
      responsible: values.responsible,
      budget: values.budget,
      status: "em andamento",
      company: values.company,
      customFields: values.customFields || [],
      logo:
        values.category === "Ambiental" ? (
          <Bird className="text-emerald-600" size={20} />
        ) : (
          <Users className="text-blue-600" size={20} />
        ),
      stats: {
        formsCount: values.forms?.length || 0,
        responsesCount: 0,
        collectorsCount: values.members?.length || 0,
        managersCount: 1,
      },
      forms: values.forms || [],
      members: values.members || [],
    };

    mockProjects.unshift(newProject);

    setProjects([...mockProjects]);

    toast.success("Projeto criado com sucesso");
    navigate({ to: "/projects" });
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
        <div className="mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Criar novo projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm
                submitLabel="Criar projeto"
                onSubmit={(values) => onCreate(values)}
              />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
