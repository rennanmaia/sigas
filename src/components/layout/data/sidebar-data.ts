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
import { type SidebarData } from "../types";
import { t } from "i18next";

export const sidebarData: SidebarData = {
  user: {
    name: t("common:sidebar.user.title"),
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
      title: t("common:sidebar.groups.title"),
      items: [
        {
          title: t("common:sidebar.groups.items.dashboard"),
          url: "/",
          icon: LayoutDashboard,

        },
        {
          title: t("common:sidebar.groups.items.projects"),
          url: "/projects",
          icon: BriefcaseBusiness,
        },
        {
          title: t("common:sidebar.groups.items.forms"),
          url: "/forms",
          icon: ClipboardList,
        },
        {
          title: t("common:sidebar.groups.items.liabilities"),
          url: "/passives",
          icon: Banknote,
        },
        {
          title: t("common:sidebar.groups.items.chats"),
          url: "/chats",
          badge: "3",
          icon: MessagesSquare,
        },
        {
          title: t("common:sidebar.groups.items.users"),
          url: "/users",
          icon: Users,
          allowedRoles: ['general_administrator']
        },
        {
          title: t("common:sidebar.groups.items.profiles"),
          url: "/profiles",
          icon: Shield,
          allowedRoles: ['general_administrator']
        },
      ],
    },
    {
      title: t("common:sidebar.others.title"),
      items: [
        {
          title: t("common:sidebar.others.items.settings.title"),
          icon: Settings,
          items: [
            {
              title: t("common:sidebar.others.items.settings.items.profile"),
              url: "/settings",
              icon: UserCog,
            },
            {
              title: t("common:sidebar.others.items.settings.items.account"),
              url: "/settings/account",
              icon: Wrench,
            },
            {
              title: t("common:sidebar.others.items.settings.items.notifications"),
              url: "/settings/notifications",
              icon: Bell,
            },
          ],
        },
        {
          title: t("common:sidebar.others.items.help.title"),
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
