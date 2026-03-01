import { Link } from '@tanstack/react-router'
import { ArrowLeft, UserPen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { FEATURE_GROUPS } from '@/features/features/data/features'
import { useProfilesStore } from '@/stores/profiles-store'
import { useTranslation } from 'react-i18next'

export default function ViewProfile({ profileId }: { profileId?: string }) {
  const { t } = useTranslation('profiles');
  const { t: tCommon } = useTranslation('common');
  const { getProfileById } = useProfilesStore()
  const profile = getProfileById(profileId || '')

  if (!profile) {
    return (
      <div className='p-6'>{t('view.notFound.message')}</div>
    )
  }

  const permsByGroup = FEATURE_GROUPS.map((g) => ({
    group: g,
    perms: g.children.filter((c) => profile.permissions.includes(c.id)),
  })).filter((g) => g.perms.length > 0)

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Link to='/profiles' className='inline-flex items-center gap-2'>
            <ArrowLeft /> {tCommon('buttons.back')}
          </Link>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitch />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className=''>
          <div className=''>
            <Card>
              <CardHeader>
                <CardTitle>{profile.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='mb-4 text-sm text-muted-foreground'>{profile.description}</div>

                <div className='space-y-4'>
                  {permsByGroup.map(({ group, perms }) => (
                    <div key={group.id} className='rounded-md border p-3'>
                      <div className='mb-2 font-medium'>{group.label}</div>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                        {perms.map((p) => (
                          <div key={p.id} className='inline-flex items-center gap-2 rounded-md border px-3 py-1'>
                            <span className='text-sm text-muted-foreground'>{p.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 flex gap-2'>
                  <Link to={`/profiles/edit/$id`} params={{ id: profile.id }}>
                    <Button variant='secondary'><UserPen size={16} className='me-2' />{t('view.buttons.edit')}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
