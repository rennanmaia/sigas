import { useLayout } from "@/context/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { AppTitle } from './app-title'
import { sidebarData } from "./data/sidebar-data";
import { useAuthStore } from '@/stores/auth-store'
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { auth } = useAuthStore()
  const role = auth.user?.role ?? []

  // filter nav items based on role - only general_administrator can see /users
  const filteredNavGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.url === '/users') return role.includes('general_administrator')
      return true
    }),
  }))
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
