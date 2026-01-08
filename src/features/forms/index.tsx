import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ConfigDrawer } from "@/components/config-drawer";
import { type NavigateFn } from "@/hooks/use-table-url-state";
import { FormsTable } from "./components/forms-table";
import { FormsPrimaryButtons } from "./components/forms-primary-button";
import { FormsProvider } from "./components/forms-provider";

interface Props {
  search: Record<string, unknown>;
  navigate: NavigateFn;
}

export default function FormList({ search, navigate }: Props) {
  return (
    <>
      <FormsProvider>
        <Header>
          <Search />
          <div className="ms-auto flex items-center gap-4">
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Formulários</h2>
              <p className="text-muted-foreground">
                Gerencie e publique seus formulários
              </p>
            </div>
            <FormsPrimaryButtons />
          </div>
          <FormsTable search={search} navigate={navigate} />
        </Main>
      </FormsProvider>
    </>
  );
}
