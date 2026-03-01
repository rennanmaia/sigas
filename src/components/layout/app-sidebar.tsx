import { useLayout } from "@/context/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from '@/stores/auth-store'
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { useSidebarStore } from "@/stores/sidebar-store";
import { AppTitle } from "./app-title";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { getNavGroups, getUser } = useSidebarStore();
  const { auth } = useAuthStore()
  const roles = auth.user?.role ?? []
  const navGroups = getNavGroups(roles);
  const user = getUser();

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle/>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
