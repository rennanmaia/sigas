import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from 'react-i18next'

export function UsersPrimaryButtons() {
  const { t } = useTranslation("users")
  const { setOpen } = useUsers()
  const { auth } = useAuthStore()
  const roles = auth.user?.role ?? []
  return (
    <div className='flex gap-2'>
      {(roles.includes('general_administrator') || roles.includes('project_administrator')) && (
        <Button
          className='space-x-1'
          onClick={() => setOpen('invite')}
        >
        <span>{t("list.buttons.add")}</span> <UserPlus size={18} />
        </Button>
      )}
    </div>
  )
}
