import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ConfigDrawer } from '@/components/config-drawer'
import { ThemeSwitch } from '@/components/theme-switch'
import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Separator } from '../ui/separator'

type PageHeaderProps = {
  backTo: LinkProps['to'];
  title?: string;
  backTitle?: string;
  fixed?: boolean;
}

export default function PageHeader({
  backTo,
  backTitle = '',
  title = '',
  fixed = true,
}: PageHeaderProps) {
    return (
        <Header fixed={fixed}>
            <div className='flex items-center gap-2'>
                <Link to={backTo} className='inline-flex items-center gap-2'>
                    <ArrowLeft /> {backTitle}
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-sm font-medium">{title}</h1>
            </div>
            <div className='ms-auto flex items-center space-x-4'>
                {/* <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown /> */}
            </div>
        </Header>
    )
}