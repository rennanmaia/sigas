import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitch } from "@/components/language-switch";
import { useTranslation } from "react-i18next";
import {
  BriefcaseBusiness,
  ClipboardList,
  Banknote,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { ProjectsOverview } from "./components/projects-overview";
import { PassivesChart } from "./components/passives-chart";
import { RecentActivity } from "./components/recent-activity";
import { ProjectStatusDistribution } from "./components/project-status-distribution";
import { PassivesSummary } from "./components/passives-summary";
import { FormsPendingList } from "./components/forms-pending-list";
import { projects } from "@/features/projects/data/projects-mock";
import { forms } from "@/features/forms/data/forms-mock";
import { useLiabilitiesStore } from "@/stores/passives-store";
import { useUsersStore } from "@/stores/users-store";

export function Dashboard() {
  const { t } = useTranslation("common");
  const { t: tDashboard } = useTranslation("dashboard");

  const { liabilities } = useLiabilitiesStore();
  const { users } = useUsersStore();

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalForms = forms.length;
  const pendingForms = forms.filter(
    (f) => f.status === "Rascunho" || f.status === "Ativo",
  ).length;
  const totalPassives = liabilities.length;
  const criticalPassives = liabilities.filter(
    (l) => l.risco === "Crítico",
  ).length;
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
          <Search />
          <div className="ms-auto flex items-center space-x-4">
            <LanguageSwitch />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {tDashboard("title")}
          </h1>
          <div className="flex items-center space-x-2">
            <Button>{t("buttons.download")}</Button>
          </div>
        </div>
        <Tabs
          orientation="vertical"
          defaultValue="overview"
          className="space-y-4"
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">
                {tDashboard("tabs.overview")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {tDashboard("tabs.analytics")}
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                {tDashboard("tabs.reports")}
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                {tDashboard("tabs.notifications")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== Overview Tab ===== */}
          <TabsContent value="overview" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Projetos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projetos Ativos
                  </CardTitle>
                  <BriefcaseBusiness className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeProjects}
                    <span className="text-muted-foreground text-sm font-normal">
                      /{totalProjects}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {totalProjects - activeProjects} projeto(s) inativos
                  </p>
                </CardContent>
              </Card>

              {/* Formulários */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Formulários Pendentes
                  </CardTitle>
                  <ClipboardList className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingForms}
                    <span className="text-muted-foreground text-sm font-normal">
                      /{totalForms}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {totalForms - pendingForms} formulário(s)
                    concluídos/arquivados
                  </p>
                </CardContent>
              </Card>

              {/* Passivos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Passivos Registrados
                  </CardTitle>
                  <Banknote className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPassives}</div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    {criticalPassives} passivo(s) com risco crítico
                  </p>
                </CardContent>
              </Card>

              {/* Usuários */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuários Ativos
                  </CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeUsers}
                    <span className="text-muted-foreground text-sm font-normal">
                      /{totalUsers}
                    </span>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {totalUsers - activeUsers} usuário(s) inativos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Evolução de Projetos</CardTitle>
                  <CardDescription>
                    Projetos criados e concluídos por mês
                  </CardDescription>
                </CardHeader>
                <CardContent className="ps-2">
                  <ProjectsOverview />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>
                    Últimas ações realizadas no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== Analytics Tab ===== */}
          <TabsContent value="analytics" className="space-y-4">
            {/* Passives Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Passivos Ambientais e Sociais</CardTitle>
                <CardDescription>
                  Evolução dos valores de passivos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <PassivesChart />
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PassivesSummary />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Status dos Projetos</CardTitle>
                  <CardDescription>
                    Distribuição por fase e situação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectStatusDistribution />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Formulários Pendentes</CardTitle>
                  <CardDescription>
                    Formulários aguardando preenchimento ou revisão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormsPendingList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
