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

const route = getRouteApi('/_authenticated/passives/')

export function Passives() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

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
            <Button className="">Novo Passivo</Button>
          </div>
        </div>

        <Tabs
          orientation="vertical"
          defaultValue="overview"
          className="space-y-4"
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4">
            <PassivesOverview />
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <div className="">
              <PassivesTable navigate={navigate} search={search}/> 
            </div>
            </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}