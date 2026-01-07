import { createFileRoute } from '@tanstack/react-router'
import ViewProfile from '@/features/profiles/view'

export const Route = createFileRoute('/_authenticated/profiles/$profileId/')({
  component: () => {
    const params = Route.useParams()
    return <ViewProfile profileId={params.profileId} />
  },
})
