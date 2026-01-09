import ViewUser from '@/features/users/view';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users/$id/')({
  component: () => {
    const { id } = Route.useParams();
    return <ViewUser id={id} />
  },
})
