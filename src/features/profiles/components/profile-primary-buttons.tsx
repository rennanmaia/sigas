import { ShieldPlus, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function UsersPrimaryButtons() {
  const { t } = useTranslation("profiles")
  return (
    <div className='flex gap-2'>
      <Button variant="outline" className="space-x-0" asChild>
        <Link to="/profiles/logs">
          <History size={18} />
          <span>{t("list.buttons.logs")}</span>
        </Link>
      </Button>
      <Button asChild className='space-x-1'>
        <Link to='/profiles/create'>
          <span>{t("list.buttons.add")}</span> <ShieldPlus size={18} />
        </Link>
      </Button>
    </div>
  )
}
