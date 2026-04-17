import { createFileRoute } from '@tanstack/react-router'
import ViewAuditSystemLog from '@/features/audit/logs/view'

export const Route = createFileRoute("/_authenticated/audit/logs/$logId/")({
  component: () => {
    const { logId } = Route.useParams();
    return <ViewAuditSystemLog logId={logId} />;
  },
});
