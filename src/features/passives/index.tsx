import { Button } from "@/components/ui/button";
import { PassivesTable } from "./components/passives-table";
import { getRouteApi } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitch } from "@/components/language-switch";

import { Main } from "@/components/layout/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PassivesOverview } from "./components/passives-overview";
import { CriticalRisksManagement } from "./components/critical-risk-management";
import { useEffect } from "react";
import {
  LiabilityView,
  type LiabilitySearch,
} from "@/routes/_authenticated/passives";
import { Link } from "@tanstack/react-router";
import { LiabilitiesProvider } from "./components/passives-provider";

const route = getRouteApi("/_authenticated/passives/");

export function Passives() {
  const { t } = useTranslation("passives");
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { view, tabs } = route.useSearch();

  const goBack = () =>
    navigate({
      search: (prev) => ({
        ...prev,
        view: LiabilityView.OVERVIEW,
        selectedId: undefined,
      }),
    });
  const setTab = (tab: LiabilitySearch["tabs"]) =>
    navigate({ search: (prev) => ({ ...prev, tabs: tab }) });

  useEffect(() => {
    if (!view) {
      goBack();
    }
  }, [view]);

  return (
    <LiabilitiesProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t("list.title")}
            </h2>
            <p className="text-muted-foreground">{t("list.description")}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Exportar Relatório</Button>
            <Link to="/passives/create">
              <Button className="">{t("list.buttons.new")}</Button>
            </Link>
          </div>
        </div>
        {view === LiabilityView.OVERVIEW && <PassivesOverview />}
        {view === LiabilityView.CRITICAL && (
          <CriticalRisksManagement onBack={goBack} />
        )}
      </Main>
    </LiabilitiesProvider>
  );
}
