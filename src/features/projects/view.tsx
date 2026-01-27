import { useParams, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  Wallet,
  CheckCircle2,
  UserPlus,
  ExternalLink,
  Clock,
  List,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  projects as mockProjects,
  projectTeam as allMembers,
  type Project,
} from "./data/projects-mock";
import { forms as allAvailableForms } from "@/features/forms/data/forms-mock";

import { ProjectsDeleteDialog } from "./components/project-delete-dialog";
import { ProjectsProvider, useProjects } from "./components/projects-provider";
import { useState, useEffect } from "react";
import { ProjectAllocateDialog } from "./components/project-allocate-dialog";
import { forms as formsMock } from "@/features/forms/data/forms-mock";
import type { FormItem } from "@/features/forms/data/forms-mock";

function ProjectDetailsContent() {
  const { projects: projectsData, setProjects } = useProjects();
  const [openDelete, setOpenDelete] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [availableForms, setAvailableForms] =
    useState<FormItem[]>(allAvailableForms);
  const { projectId } = useParams({
    from: "/_authenticated/projects/$projectId/",
  });

  useEffect(() => {
    const loadForms = () => {
      const savedForms = localStorage.getItem("local-forms");
      if (savedForms) {
        try {
          const parsedForms = JSON.parse(savedForms);
          setAvailableForms(parsedForms);
        } catch (error) {
          console.error("Erro ao carregar formulários:", error);
          setAvailableForms(allAvailableForms);
        }
      }
    };

    loadForms();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "local-forms") {
        loadForms();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleCustomEvent = () => {
      loadForms();
    };

    window.addEventListener("forms-updated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("forms-updated", handleCustomEvent);
    };
  }, [projectId]);

  const project = projectsData.find((p) => p.id === projectId);

  if (!project)
    return (
      <Main className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Projeto não encontrado</h2>
          <Link to="/projects" className="text-primary hover:underline">
            Voltar para a lista
          </Link>
        </div>
      </Main>
    );
  const updateProjectData = (newData: Partial<Project>) => {
    setProjects((prev) => {
      const newList = prev.map((p) =>
        p.id === projectId ? { ...p, ...newData } : p,
      );

      mockProjects.length = 0;
      mockProjects.push(...newList);

      return newList;
    });
  };
  const handleConfirmForms = (selectedIds: string[]) => {
    const savedForms = localStorage.getItem("local-forms");
    if (savedForms) {
      try {
        const parsedForms = JSON.parse(savedForms);
        const updatedFormsList = parsedForms.map((form: any) => {
          if (selectedIds.includes(form.id)) {
            return {
              ...form,
              projectId: projectId,
              status: "Ativo",
            };
          }
          return form;
        });
        localStorage.setItem("local-forms", JSON.stringify(updatedFormsList));

        selectedIds.forEach((formId) => {
          const formIndex = formsMock.findIndex((f) => f.id === formId);
          if (formIndex !== -1) {
            formsMock[formIndex].projectId = projectId;
            formsMock[formIndex].status = "Ativo";
          }
        });
      } catch (error) {
        console.error("Erro ao atualizar projectId dos formulários:", error);
      }
    }

    const updatedForms = [...(project.forms || []), ...selectedIds];
    updateProjectData({
      forms: updatedForms,
      stats: { ...project.stats, formsCount: updatedForms.length },
    });
  };

  const handleConfirmMembers = (selectedIds: string[]) => {
    const updatedMembers = [...(project.members || []), ...selectedIds];
    updateProjectData({
      members: updatedMembers,
      stats: { ...project.stats, collectorsCount: updatedMembers.length },
    });
  };

  const currentProjectForms = availableForms.filter(
    (f) => f.projectId === projectId,
  );

  const totalResponses = currentProjectForms.reduce(
    (sum, form) => sum + (form.responses || 0),
    0,
  );

  const calculateTimeProgress = () => {
    if (!project.startDate || !project.endDate) return 0;

    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;

    if (now > end) return 100;

    const totalDuration = end - start;
    const elapsed = now - start;
    const progress = (elapsed / totalDuration) * 100;

    return Math.round(progress);
  };

  const timeProgress = calculateTimeProgress();
  const responsibleMember = allMembers.find(
    (m) => m.name === project.responsible,
  );

  const otherMembers = allMembers.filter(
    (m) => project.members?.includes(m.id) && m.name !== project.responsible,
  );

  const currentProjectTeam = responsibleMember
    ? [responsibleMember, ...otherMembers]
    : otherMembers;
  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/projects">
              <ArrowLeft size={18} />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-sm font-medium">Detalhes do Projeto</h1>
        </div>
      </Header>

      <Main className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary p-2">
              {project.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {project.title}
                </h2>
                <Badge variant="secondary" className="uppercase text-[10px]">
                  {project.category}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm max-w-2xl">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select defaultValue={project.status}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="em andamento">
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> Em andamento
                  </div>
                </SelectItem>
                <SelectItem value="concluido">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} /> Concluído
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/20 hover:bg-destructive/10 gap-2"
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 size={16} />
              Excluir
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link
                to="/projects/$projectId/edit"
                params={{ projectId: project.id }}
              >
                <Edit size={16} /> Editar
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Empresa Responsável e Campos Extras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Empresa Responsável
                </Label>
                <p className="text-sm font-medium text-foreground">
                  {project.company || "Não informada"}
                </p>
              </div>

              {project.customFields && project.customFields.length > 0 ? (
                project.customFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="space-y-1 border-l pl-4 sm:border-l-0 sm:pl-0 lg:border-l lg:pl-4"
                  >
                    <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {field.label}
                    </Label>
                    <p className="text-sm font-medium text-foreground">
                      {field.value}
                    </p>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-1 lg:col-span-3">
                  <p className="text-xs text-muted-foreground italic mt-5">
                    Nenhum campo personalizado adicionado.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cronograma (Início / Término)
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm font-bold ">
                <span>{project.startDate}</span>
                <span>{project.endDate}</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {timeProgress}% do prazo total consumido
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Respostas
              </CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses}</div>
              <p className="text-muted-foreground text-xs">Dados coletados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(project.budget)}
              </div>
              <p className="text-muted-foreground text-xs">Total investido</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Formulários do Projeto</CardTitle>
                <CardDescription>
                  Gerencie os questionários vinculados.
                </CardDescription>
              </div>
              <Badge variant="outline">
                {currentProjectForms.length} Total
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentProjectForms.length > 0 ? (
                  currentProjectForms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <FileText size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {form.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {form.responses} respostas
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link to="/forms/edit/$id" params={{ id: form.id }}>
                          <ExternalLink size={14} />
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhum formulário vinculado.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => setOpenFormDialog(true)}
                >
                  + Vincular Novo Formulário
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Equipe</CardTitle>
                <CardDescription>Usuários ativos no campo.</CardDescription>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setOpenMemberDialog(true)}
              >
                <UserPlus size={16} /> Alocar Membro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {currentProjectTeam.length > 0 ? (
                  currentProjectTeam.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{member.initial}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] cursor-pointer"
                      >
                        Ver Perfil
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhum membro alocado.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
      <ProjectAllocateDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        title="Vincular Formulários"
        description="Selecione os formulários que deseja adicionar a este projeto. Apenas formulários sem projeto (Rascunho) podem ser vinculados."
        items={availableForms
          .filter((f) => f.status === "Rascunho" && !f.projectId)
          .map((f) => ({
            id: f.id,
            label: f.title,
            sublabel: f.status,
          }))}
        alreadySelected={project.forms || []}
        onConfirm={handleConfirmForms}
        projectId={projectId}
      />

      <ProjectAllocateDialog
        open={openMemberDialog}
        onOpenChange={setOpenMemberDialog}
        title="Alocar Equipe"
        description="Selecione os profissionais para atuar neste projeto."
        items={allMembers
          .filter((m) => !m.role.toLowerCase().includes("gerente"))
          .map((m) => ({
            id: m.id,
            label: m.name,
            sublabel: m.role,
          }))}
        alreadySelected={project.members || []}
        onConfirm={handleConfirmMembers}
      />
      <ProjectsDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        currentRow={{ id: project.id, title: project.title }}
      />
    </>
  );
}

export function ProjectDetails() {
  return (
    <ProjectsProvider>
      <ProjectDetailsContent />
    </ProjectsProvider>
  );
}
