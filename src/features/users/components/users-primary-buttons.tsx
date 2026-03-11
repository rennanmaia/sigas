import { UserPlus, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
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
      <Button variant="outline" className="space-x-0" asChild>
        <Link to="/users/logs">
          <History size={18} />
          <span>{t("list.buttons.logs")}</span>
        </Link>
      </Button>
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
