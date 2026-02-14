import { type ChangeEvent, useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
import { LanguageSwitch } from "@/components/language-switch";
import { ProjectsProvider, useProjects } from "./components/projects-provider";
import { PROJECT_STATUS, type ProjectStatus } from "./data/projects-mock";

const route = getRouteApi("/_authenticated/projects/");

function ProjectsList() {
  const { t } = useTranslation("projects");
  const { projects: projectsData } = useProjects();
  const {
    filter = "",
    type = "all",
    sort: initSort = "asc",
  } = route.useSearch();
  const navigate = route.useNavigate();

  const [sort, setSort] = useState(initSort);
  const [projectType, setProjectType] = useState(type as ProjectStatus | "all");
  const [searchTerm, setSearchTerm] = useState(filter);

  const filteredProjects = projectsData
    .sort((a, b) =>
      sort === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    )
    .filter((project) => {
      if (projectType === "all") return true;
      if (projectType === "expired") {
        return (
          project.status === "active" && new Date(project.endDate) < new Date()
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

  const handleTypeChange = (value: ProjectStatus | "all") => {
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
          <LanguageSwitch />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-1">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("list.title")}</h1>
            <p className="text-muted-foreground">{t("list.description")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="space-x-0" asChild>
              <Link to="/projects/logs">
                <History size={18} />
                <span>{t("list.buttons.logs")}</span>
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link to="/projects/create">
                <span>{t("list.buttons.new")}</span> <Folder size={18} />
              </Link>
            </Button>
          </div>
        </div>

        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder={t("list.searchPlaceholder")}
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select
              value={projectType}
              onValueChange={(v) => handleTypeChange(v as ProjectStatus | "all")}
            >
              <SelectTrigger className="w-36">
                <SelectValue>{t(`list.filters.${projectType}`)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("list.filters.all")}</SelectItem>
                <SelectItem value="ativo">{t("list.filters.active")}</SelectItem>
                <SelectItem value="pausado">{t("list.filters.paused")}</SelectItem>
                <SelectItem value="finalizado">{t("list.filters.finished")}</SelectItem>
                <SelectItem value="cancelado">{t("list.filters.canceled")}</SelectItem>
                <SelectItem value="expirado">{t("list.filters.expired")}</SelectItem>
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
              project.status === PROJECT_STATUS.active &&
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
                          : project.status === PROJECT_STATUS.finished
                            ? "border-green-300 bg-green-50 text-green-700"
                            : project.status === PROJECT_STATUS.active
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : project.status === PROJECT_STATUS.paused
                                ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                : project.status === PROJECT_STATUS.canceled
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : ""
                      }
                    >
                      {isExpired
                        ? "Expirado"
                        : project.status === PROJECT_STATUS.finished
                          ? "Finalizado"
                          : project.status === PROJECT_STATUS.active
                            ? "Ativo"
                            : project.status === PROJECT_STATUS.paused
                              ? "Pausado"
                              : project.status === PROJECT_STATUS.canceled
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
