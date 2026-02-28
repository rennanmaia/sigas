import ViewLiability from '@/features/passives/view';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/passives/$passiveId/')({
  component: ViewLiability,
});