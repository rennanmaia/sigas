import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileForm from '@/features/profiles/components/profile-form'
import type { Profile } from '../data/schema'
import type { FormValues } from '@/features/profiles/components/profile-form'
import { Main } from '@/components/layout/main'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { useProfilesStore } from '@/stores/profiles-store'
import { useTranslation } from 'react-i18next'

const route = getRouteApi('/_authenticated/profiles/')
export function CreateProfile() {
	const { t } = useTranslation('profiles');
	const { t: tCommon } = useTranslation('common');
	const { addProfile } = useProfilesStore()
	const navigate = route.useNavigate();

	const onCreate = (values: FormValues) => {
		const newProfile: Profile = {
			id: `${values.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
			label: values.name,
			value: values.name.toLowerCase().replace(/\s+/g, '-'),
			description: values.description,
			permissions: values.permissions,
		}
		addProfile(newProfile)
		toast.success('Profile created')
		navigate({ to: '/profiles' })
	}

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
				<div className='lg:col-span-2'>
					<Card>
						<CardHeader>
							<CardTitle>{t('create.title')}</CardTitle>
						</CardHeader>
						<CardContent>
							<ProfileForm
								submitLabel={t('create.actions.creationSubmitLabel')}
								onSubmit={(values) => onCreate(values)}
								onCancel={() => navigate({ to: '/profiles' })}
							/>
						</CardContent>
					</Card>
				</div>
			</Main>
		</>
	)
}

export default CreateProfile
