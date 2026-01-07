import CreateProfile from '@/features/profiles/create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profiles/create/')({
  component: CreateProfile,
})
