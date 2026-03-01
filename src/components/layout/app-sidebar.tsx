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
import { TeamSwitcher } from "./team-switcher";
import { useSidebarStore } from "@/stores/sidebar-store";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { getNavGroups, getTeams, getUser } = useSidebarStore();
  const { auth } = useAuthStore()
  const roles = auth.user?.role ?? []
  const teams = getTeams();
  const navGroups = getNavGroups(roles);
  const user = getUser();

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
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
