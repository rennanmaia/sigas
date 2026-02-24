import { LiabilityDeleteDialog } from "./passive-delete-dialog"
import { useLiabilities } from "./passives-provider"

export function LiabilityDialogs() {
  const { currentRow, open, setOpen, setCurrentRow } = useLiabilities()
  return (
    <>
      {currentRow && (
          <>
            <LiabilityDeleteDialog
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
