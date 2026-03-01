import type { I18nKey } from '@/i18n/types';
import { type LinkProps } from '@tanstack/react-router'
type User = {
  name: string;
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

type BaseNavItem = {
  title: I18nKey<'common'>
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never,
}

type NavItem = (NavCollapsible | NavLink) & {
  allowedRoles?: string[]
}

type NavGroup = {
  title: I18nKey<'common'>
  items: NavItem[]
}

type SidebarData = {
  user: User
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
