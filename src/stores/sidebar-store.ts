import { create } from "zustand";
import {
  LayoutDashboard,
  HelpCircle,
  Bell,
  Settings,
  Wrench,
  UserCog,
  Users,
  MessagesSquare,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  BriefcaseBusiness,
  ClipboardList,
  Banknote,
  Shield
} from "lucide-react";
import type { SidebarData } from "@/components/layout/types";

interface SidebarsStore {
  sidebarData: SidebarData;
  getSidebarData: () => SidebarData;
  getTeams: () => SidebarData['teams'];
  getUser: () => SidebarData['user'];
  getNavGroups: (roles: string[]) => SidebarData['navGroups'];
  setUser: (user: SidebarData['user']) => void;
}

export const useSidebarStore = create<SidebarsStore>((set, get) => ({
    sidebarData: {
        user: {
            name: "usuário",
            email: "usuario@sigas.com",
            avatar: "/avatars/shadcn.jpg",
        },
        teams: [
            {
                name: "Projeto 1",
                logo: Command,
                plan: "",
            },
            {
                name: "Projeto 2",
                logo: GalleryVerticalEnd,
                plan: " ",
            },
            {
                name: "Projeto 3",
                logo: AudioWaveform,
                plan: " ",
            },
        ],
        navGroups: [
            {
            title: "sidebar.groups.title",
            items: [
                {
                    title: "sidebar.groups.items.dashboard",
                    url: "/",
                    icon: LayoutDashboard,
                },
                {
                    title: "sidebar.groups.items.projects",
                    url: "/projects",
                    icon: BriefcaseBusiness,
                },
                {
                    title: "sidebar.groups.items.forms",
                    url: "/forms",
                    icon: ClipboardList,
                },
                {
                    title: "sidebar.groups.items.liabilities",
                    url: "/passives",
                    icon: Banknote,
                },
                {
                    title: "sidebar.groups.items.chats",
                    url: "/chats",
                    badge: "3",
                    icon: MessagesSquare,
                },
                {
                    title: "sidebar.groups.items.users",
                    url: "/users",
                    icon: Users,
                    allowedRoles: ['general_administrator']
                },
                {
                    title: "sidebar.groups.items.profiles",
                    url: "/profiles",
                    icon: Shield,
                    allowedRoles: ['general_administrator']
                },
            ],
            },
            {
                title: "sidebar.others.title",
                items: [
                    {
                    title: "sidebar.others.items.settings.title",
                    icon: Settings,
                    items: [
                            {
                                title: "sidebar.others.items.settings.items.profile",
                                url: "/settings",
                                icon: UserCog,
                            },
                            {
                                title: "sidebar.others.items.settings.items.account",
                                url: "/settings/account",
                                icon: Wrench,
                            },
                            {
                                title: "sidebar.others.items.settings.items.notifications",
                                url: "/settings/notifications",
                                icon: Bell,
                            },
                        ],
                    },
                    {
                        title: "sidebar.others.items.help.title",
                        url: "/help-center",
                        icon: HelpCircle,
                    },
                ],
            },
        ],
    },
    getSidebarData: () => {
        return get().sidebarData;
    },
    getNavGroups: (roles) => {
        return get().sidebarData.navGroups.map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                if (item.allowedRoles && item.allowedRoles.length > 0) {
                return item.allowedRoles.some(role => roles.includes(role))
                }
                return true
            }),
        }));
    },
    getTeams: () => get().sidebarData.teams,
    getUser: () => get().sidebarData.user,
    setUser: (user) => set((state) => ({
        sidebarData: {
            ...state.sidebarData,
            user,
        }
    })),
}));