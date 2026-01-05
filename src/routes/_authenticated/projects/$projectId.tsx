import { createFileRoute } from '@tanstack/react-router'
import { ProjectDetails } from '@/features/projects/view'

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: ProjectDetails,
})