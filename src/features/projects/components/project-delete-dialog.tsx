import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { DeleteDialog, type DeleteDialogConfig } from "@/components/delete-dialog";
import { useProjects } from "./projects-provider";

type ProjectDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: { id: string; title: string };
};

export function ProjectsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProjectDeleteDialogProps) {
  const { deleteProject } = useProjects();
  const navigate = useNavigate();

  const config: DeleteDialogConfig = {
    mode: "single",
    item: {
      id: currentRow.id,
      label: currentRow.title,
    },
    namespace: "projects",
    confirmStrategy: "typed",
    onDelete: (id) => {
      deleteProject(id as string);
      toast.success(`Project "${currentRow.title}" deleted successfully`);
    },
    onBeforeClose: () => {
      navigate({ to: "/projects" });
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