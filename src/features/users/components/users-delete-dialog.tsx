"use client";

import { toast } from "sonner";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import { type User } from "../data/schema";
import { useUsersStore } from "@/stores/users-store";

type UserDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
};

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const { deleteUser } = useUsersStore();

  const config: DeleteDialogConfig = {
    mode: "single",
    item: {
      id: currentRow.id,
      label: currentRow.username,
    },
    namespace: "users",
    confirmStrategy: "typed",
    onDelete: (id) => {
      deleteUser(id as string);
      toast.success("User deleted successfully");
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
