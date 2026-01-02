import { Link } from '@tanstack/react-router'
import { ArrowLeft, Trash2, UserPen } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { ThemeSwitch } from '@/components/theme-switch'
import { featureGroups } from '@/features/features/data/features'
import { profiles } from '@/features/profiles/data/profiles'

export default function ViewProfile({ profileId }: { profileId?: string }) {
  const profile = profiles.find((p) => p.id === profileId)

  if (!profile) {
    return (
      <div className='p-6'>Profile not found.</div>
    )
  }

  const handleDelete = () => {
    if (!confirm(`Delete profile ${profile.label}? This cannot be undone.`)) return
    const idx = profiles.findIndex((p) => p.id === profile.id)
    if (idx !== -1) profiles.splice(idx, 1)
    toast.success('Profile deleted')
    window.location.href = '/profiles'
  }

  const permsByGroup = featureGroups.map((g) => ({
    group: g,
    perms: g.children.filter((c) => profile.permissions.includes(c.id)),
  })).filter((g) => g.perms.length > 0)

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Link to='/profiles' className='inline-flex items-center gap-2'>
            <ArrowLeft /> Back
          </Link>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
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
                            <span className='font-mono text-xs'>{p.id}</span>
                            <span className='text-sm text-muted-foreground'>{p.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 flex gap-2'>
                  <Link to={`/profiles/edit/$id`} params={{ id: profile.id }}>
                    <Button variant='secondary'><UserPen size={16} className='me-2' /> Edit</Button>
                  </Link>
                  <Button variant='destructive' onClick={handleDelete}><Trash2 size={16} className='me-2' /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
