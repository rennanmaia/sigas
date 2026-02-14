import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { profiles } from '@/features/profiles/data/profiles'
import ProfileForm from '@/features/profiles/components/profile-form'
import type { FormValues } from '@/features/profiles/components/profile-form'
import { Route } from '@/routes/_authenticated/profiles/edit/$id'

function EditProfile() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();

  const profile = profiles.find((p) => p.id === id)

  if (!profile) {
    return (
      <>
        <Header fixed>
          <div />
          <div className='ms-auto flex items-center space-x-4'>
            <LanguageSwitch />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='p-6'>Profile not found.</div>
        </Main>
      </>
    )
  }

  const onSubmit = (values: FormValues) => {
    // mutate in-memory profile
    const idx = profiles.findIndex((p) => p.id === profile.id)
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], label: values.name, description: values.description, permissions: values.permissions }
      toast.success('Profile updated')
      navigate({ to: '/profiles' })
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Link to='/profiles' className='inline-flex items-center gap-2'>
            <ArrowLeft /> Back
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
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Edit profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  initialValues={profile}
                  submitLabel='Save changes'
                  onSubmit={onSubmit}
                  onCancel={() => navigate({ to: '/profiles' })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

export default EditProfile
