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
import { projects as projectsData } from "./data/projects";

const projectForms = [
  {
    id: "frm-1",
    title: "Checklist de Campo - Fauna",
    responses: 840,
    status: "Ativo",
  },
  {
    id: "frm-2",
    title: "Registro de Avistamento Especial",
    responses: 400,
    status: "Ativo",
  },
  {
    id: "frm-3",
    title: "Relatório de Incidentes Ambientais",
    responses: 0,
    status: "Rascunho",
  },
];

const projectTeam = [
  { id: "u-1", name: "Ana Silva", role: "Gerente de Projeto", initial: "AS" },
  { id: "u-2", name: "Lucas Martins", role: "Coletor Pleno", initial: "LM" },
  { id: "u-3", name: "Patrícia Rocha", role: "Coletor Júnior", initial: "PR" },
];

export function ProjectDetails() {
  const { projectId } = useParams({
    from: "/_authenticated/projects/$projectId",
  });
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

  const timeProgress = 65;

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
              <SelectTrigger className="w-[160px] h-9">
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
              <div className="text-2xl font-bold">
                {project.stats.responsesCount}
              </div>
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
                {" "}
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
              <Badge variant="outline">{project.stats.formsCount} Total</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectForms.map((form) => (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed">
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

              <Button variant="outline" className="gap-2">
                <UserPlus size={16} /> Alocar Membro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {projectTeam.map((member) => (
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
                    <Badge variant="secondary" className="text-[10px]">
                      Ver Perfil
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
