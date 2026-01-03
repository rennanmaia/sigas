import { type ChangeEvent, useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { SlidersHorizontal, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
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
import { projects as projectsData } from "./data/projects";
const route = getRouteApi("/_authenticated/projects/");
type ProjectType = "all" | "concluido" | "emAndamento";

const projectText = new Map<ProjectType, string>([
  ["all", "Todos os projetos"],
  ["concluido", "Concluídos"],
  ["emAndamento", "Em andamento"],
]);

export function Projects() {
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
        : b.title.localeCompare(a.title)
    )
    .filter((project) =>
      projectType === "concluido"
        ? project.status === "concluido"
        : projectType === "emAndamento"
          ? project.status === "em andamento"
          : true
    )
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    navigate({
      search: (prev) => ({
        ...prev,
        filter: e.target.value || undefined,
      }),
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

  const handleSortChange = (sort: "asc" | "desc") => {
    setSort(sort);
    navigate({ search: (prev) => ({ ...prev, sort }) });
  };

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className="ms-auto flex items-center gap-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Lista de todos os projetoss</p>
        </div>
        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filtrar projetos..."
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
                <SelectItem value="concluido">Concluídos</SelectItem>
                <SelectItem value="emAndamento">Em andamento</SelectItem>
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
          {filteredProjects.map((project) => (
            <li
              key={project.title}
              className="rounded-lg border p-4 hover:shadow-md"
            >
              <div className="mb-8 flex items-center justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                >
                  {project.logo}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${project.status === "concluido" ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900" : ""}`}
                >
                  {project.status === "concluido"
                    ? "Concluído"
                    : "Em andamento"}
                </Button>
              </div>
              <div>
                <h2 className="mb-1 font-semibold">{project.title}</h2>
                <p className="line-clamp-2 text-gray-500">
                  {project.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  );
}
