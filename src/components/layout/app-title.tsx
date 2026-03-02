import { Link } from "@tanstack/react-router";

import logoSigas from "@/assets/sigas-logo-icon.png";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppTitle() {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div>
            <Link
              to="/"
              onClick={() => setOpenMobile(false)}
              className="grid flex-1 text-start text-sm leading-tight"
            >
              <div className="flex items-center gap-2">
                <img src={logoSigas} alt="" className="h-8 w-8 shrink-0" />
                <span
                  className="truncate font-bold text-sm"
                  title="Sistema Integrado de Gestão Social e Ambiental"
                >
                  SIGAS
                </span>
              </div>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
