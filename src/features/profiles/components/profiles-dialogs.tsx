import { ProfilesDeleteDialog } from './profile-delete-dialog'
import { useProfiles } from './profiles-provider'

export function ProfilesDialogs() {
  const { currentRow, open, setOpen, setCurrentRow } = useProfiles()
  return (
    <>
      {currentRow && (
          <>
            <ProfilesDeleteDialog
              key={`profile-delete-${currentRow.id}`}
              open={open === 'delete'}
              onOpenChange={() => {
                setOpen('delete')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
            />
          </>
        )}
    </>
  )
}
