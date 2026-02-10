import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfilesDialogs } from './components/profiles-dialogs'
import { UsersPrimaryButtons } from './components/profile-primary-buttons'
import { ProfilesProvider } from './components/profiles-provider'
import { ProfilesTable } from './components/profiles-table'
import { profiles } from './data/profiles'
import { useTranslation } from 'react-i18next'

const route = getRouteApi('/_authenticated/profiles/')

export function Profiles() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { t } = useTranslation("profiles")

  return (
    <ProfilesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("list.title")}</h2>
            <p className='text-muted-foreground'>
              {t("list.description")}
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
          <ProfilesTable data={profiles} search={search} navigate={navigate} />
      </Main>

      <ProfilesDialogs />
    </ProfilesProvider>
  )
}
