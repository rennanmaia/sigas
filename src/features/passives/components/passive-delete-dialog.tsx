"use client";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import type { Liability } from "../data/schema";
import { useLiabilitiesStore } from "@/stores/passives-store";

type ProfileDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Liability;
};

export function LiabilityDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProfileDeleteDialogProps) {
  const { t } = useTranslation("common");
  const { deleteLiability } = useLiabilitiesStore();

  const config: DeleteDialogConfig = {
    mode: "single",
    item: {
      id: currentRow.id ?? '',
      label: currentRow.nome,
    },
    namespace: "liability",
    confirmStrategy: "typed",
    onDelete: (id) => {
      deleteLiability(id as string);
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
