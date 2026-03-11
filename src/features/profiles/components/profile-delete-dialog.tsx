"use client";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import { useProfilesStore } from "@/stores/profiles-store";
import type { Profile } from "../data/schema";

type ProfileDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Profile;
};

export function ProfilesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProfileDeleteDialogProps) {
  const { t } = useTranslation("common");
  const { deleteProfile, addLog } = useProfilesStore();

  const config: DeleteDialogConfig = {
    mode: "single",
    item: {
      id: currentRow.id,
      label: currentRow.label,
    },
    namespace: "profiles",
    confirmStrategy: "typed",
    onDelete: (id) => {
      deleteProfile(id as string);
      addLog("exclusão", id as string, currentRow.label, `Perfil "${currentRow.label}" foi excluído.`);
      toast.success(t("deleteDialog.confirmButton"));
    },
  };

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      config={config}
    />
  );
}
