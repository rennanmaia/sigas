import FormCreate from "@/features/forms/create";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/forms/edit/$id")({
  component: EditFormPage,
});

function EditFormPage() {
  const { id } = Route.useParams();

  return <FormCreate initialId={id} />;
}
