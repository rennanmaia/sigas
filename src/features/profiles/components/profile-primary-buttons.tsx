import { ShieldPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function UsersPrimaryButtons() {
  const { t } = useTranslation("profiles")
  return (
    <div className='flex gap-2'>
      <Button asChild className='space-x-1'>
        <Link to='/profiles/create'>
          <span>{t("list.buttons.add")}</span> <ShieldPlus size={18} />
        </Link>
      </Button>
    </div>
  )
}
