import { type ChangeEvent, useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import {
  SlidersHorizontal,
  ArrowUpAZ,
  ArrowDownAZ,
  Folder,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProjectsProvider, useProjects } from "./components/projects-provider";

const route = getRouteApi("/_authenticated/projects/");
type ProjectType =
  | "all"
  | "ativo"
  | "pausado"
  | "finalizado"
  | "cancelado"
  | "expirado";

const projectText = new Map<ProjectType, string>([
  ["all", "Todos os projetos"],
  ["ativo", "Ativos"],
  ["pausado", "Pausados"],
  ["finalizado", "Finalizados"],
  ["cancelado", "Cancelados"],
  ["expirado", "Expirados"],
]);

function ProjectsList() {
  const { projects: projectsData } = useProjects();
  const {
    filter = "",
    type = "all",
    sort: initSort = "asc",
  } = route.useSearch();
  const navigate = route.useNavigate();

  const [sort, setSort] = useState(initSort);
  const [projectType, setProjectType] = useState(type as ProjectType);
  const [searchTerm, setSearchTerm] = useState(filter);

  const filteredProjects = projectsData
    .sort((a, b) =>
      sort === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    )
    .filter((project) => {
      if (projectType === "all") return true;
      if (projectType === "expirado") {
        return (
          project.status === "ativo" && new Date(project.endDate) < new Date()
        );
      }
      return project.status === projectType;
    })
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    navigate({
      search: (prev) => ({ ...prev, filter: e.target.value || undefined }),
    });
  };

  const handleTypeChange = (value: ProjectType) => {
    setProjectType(value);
    navigate({
      search: (prev) => ({
        ...prev,
        type: value === "all" ? undefined : value,
      }),
    });
  };
  const handleSortChange = (value: "asc" | "desc") => {
    setSort(value);
    navigate({
      search: (prev) => ({ ...prev, sort: value }),
    });
  };
  return (
    <>
      <Header>
        <Search />
        <div className="ms-auto flex items-center gap-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-1">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
            <p className="text-muted-foreground">Gerencie seus projetos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="space-x-0" asChild>
              <Link to="/projects/logs">
                <History size={18} />
                <span>Histórico</span>
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link to="/projects/create">
                <span>Criar projeto</span> <Folder size={18} />
              </Link>
            </Button>
          </div>
        </div>

        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Procurar projetos..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select
              value={projectType}
              onValueChange={(v) => handleTypeChange(v as ProjectType)}
            >
              <SelectTrigger className="w-36">
                <SelectValue>{projectText.get(projectType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="pausado">Pausados</SelectItem>
                <SelectItem value="finalizado">Finalizados</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
                <SelectItem value="expirado">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={sort}
            onValueChange={(v) => handleSortChange(v as "asc" | "desc")}
          >
            <SelectTrigger className="w-16">
              <SelectValue>
                <SlidersHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="asc">
                <div className="flex items-center gap-4">
                  <ArrowUpAZ size={16} />
                  <span>Crescente</span>
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-4">
                  <ArrowDownAZ size={16} />
                  <span>Decrescente</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="shadow-sm" />

        <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const isExpired =
              project.status === "ativo" &&
              new Date(project.endDate) < new Date();
            return (
              <li key={project.id}>
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  className="group block h-full rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2 transition-colors group-hover:bg-primary/10">
                      {project.logo}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        isExpired
                          ? "border-orange-300 bg-orange-50 text-orange-700"
                          : project.status === "finalizado"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : project.status === "ativo"
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : project.status === "pausado"
                                ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                : project.status === "cancelado"
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : ""
                      }
                    >
                      {isExpired
                        ? "Expirado"
                        : project.status === "finalizado"
                          ? "Finalizado"
                          : project.status === "ativo"
                            ? "Ativo"
                            : project.status === "pausado"
                              ? "Pausado"
                              : project.status === "cancelado"
                                ? "Cancelado"
                                : project.status}
                    </Button>
                  </div>
                  <div>
                    <h2 className="mb-1 font-semibold group-hover:text-primary">
                      {project.title}
                    </h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Main>
    </>
  );
}

export function Projects() {
  return (
    <ProjectsProvider>
      <ProjectsList />
    </ProjectsProvider>
  );
}
