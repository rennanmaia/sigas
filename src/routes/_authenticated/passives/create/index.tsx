import CreatePassive from '@/features/passives/create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/passives/create/')({
  component: CreatePassive,
})