import { Button } from "@/components/ui/button";
import { PassivesTable } from './components/passives-table';
import { getRouteApi } from '@tanstack/react-router';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { ConfigDrawer } from '@/components/config-drawer';
import { Main } from '@/components/layout/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PassivesOverview } from './components/passives-overview';
import { CriticalRisksManagement } from "./components/critical-risk-management";
import { useEffect } from "react";
import { LiabilityView, type LiabilitySearch } from "@/routes/_authenticated/passives";
import { Link } from "@tanstack/react-router";

const route = getRouteApi('/_authenticated/passives/')

export function Passives() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { view, tabs } = route.useSearch()

  const goBack = () => navigate({ search: (prev) => ({ ...prev, view: LiabilityView.OVERVIEW, selectedId: undefined }) })
  const setTab = (tab: LiabilitySearch['tabs']) => navigate({ search: (prev) => ({ ...prev, tabs: tab }) })
    
  useEffect(() => {
    if (!view) {
      goBack()
    }
  }, [view])

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Passivos</h2>
            <p className='text-muted-foreground'>
              Manage your passives here.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Exportar Relatório</Button>
            <Link to='/passives/create'>
              <Button className="">Novo Passivo</Button>
            </Link>
          </div>
        </div>

        <Tabs
          orientation="vertical"
          defaultValue={tabs}
          value={tabs}
          className="space-y-4"
          onValueChange={(e) => {
            setTab(e as LiabilitySearch['tabs'])
          }}
          
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value={LiabilityView.OVERVIEW}>Overview</TabsTrigger>
              <TabsTrigger value={LiabilityView.LIST}>List</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={LiabilityView.OVERVIEW} className="space-y-4">
            {view === LiabilityView.OVERVIEW && <PassivesOverview />}
            {view === LiabilityView.CRITICAL && <CriticalRisksManagement onBack={goBack} />}
          </TabsContent>
          <TabsContent value={LiabilityView.LIST} className="space-y-4">
            <PassivesTable navigate={navigate as any} search={search}/> 
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}