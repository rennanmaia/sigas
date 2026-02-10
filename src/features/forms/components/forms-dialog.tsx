import { FormDeleteDialog } from "./form-delete-dialog";
import { useForms } from "./forms-provider";
export function FormsDialog() {
  const { currentForm, open, setOpen, setCurrentForm } = useForms();
  if (!currentForm) return null;
  return (
    <>
      {currentForm && (
        <FormDeleteDialog
          key={`form-delete-${currentForm.id}`}
          open={open === "delete"}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null);
              setTimeout(() => setCurrentForm(null), 300);
            }
          }}
          currentRow={currentForm}
        />
      )}
    </>
  );
}
