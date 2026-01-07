import EditProfile from '@/features/profiles/edit';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profiles/edit/$id/')({
    component: EditProfile,
});