import EditLiability from '@/features/passives/edit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/passives/$passiveId/edit',
)({
  component: EditLiability,
})
