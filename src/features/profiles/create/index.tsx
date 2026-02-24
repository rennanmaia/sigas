import { useState } from 'react'
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
import { profiles } from '../data/profiles'
import { useTranslation } from 'react-i18next'

const route = getRouteApi('/_authenticated/profiles/')
export function CreateProfile() {
	const { t } = useTranslation('profiles');
	const { t: tCommon } = useTranslation('common');
	const [logs, setLogs] = useState<Array<{ id: string; when: string; name: string; permissions: string[] }>>([])
	const navigate = route.useNavigate();

	const onCreate = (values: FormValues) => {
		const newProfile: Profile = {
			id: `${values.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
			label: values.name,
			value: values.name.toLowerCase().replace(/\s+/g, '-'),
			description: values.description,
			permissions: values.permissions,
		}
		profiles.unshift(newProfile)
		const logEntry = { id: newProfile.id, when: new Date().toISOString(), name: values.name, permissions: values.permissions }
		setLogs((s) => [logEntry, ...s])
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
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
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

					<div>
						<Card>
							<CardHeader>
								<CardTitle>{t('logs.title')}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{logs.length === 0 ? (
										<div className='text-sm text-muted-foreground'>{t('logs.empty')}</div>
									) : (
										logs.map((l) => (
											<div key={l.id} className='rounded-md border p-3'>
												<div className='text-sm font-medium'>{l.name}</div>
												<div className='text-xs text-muted-foreground'>{new Date(l.when).toLocaleString()}</div>
												<div className='mt-2 text-sm'>
													{t('logs.permissions.label')}: <span className='text-xs font-mono'>{l.permissions.join(', ')}</span>
												</div>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</Main>
		</>
	)
}

export default CreateProfile
