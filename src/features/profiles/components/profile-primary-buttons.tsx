import { ShieldPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfiles } from './profiles-provider'

export function UsersPrimaryButtons() {
  const { setOpen } = useProfiles()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Profile</span> <ShieldPlus size={18} />
      </Button>
    </div>
  )
}
