import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "../data/schema";
import { callTypes } from "../data/data";
import { cn } from "@/lib/utils";

export default function UserStatusBadge({
    status
}: {status: UserStatus}) {
      const badgeColor = callTypes.get(status);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {status}
          </Badge>
        </div>
      );
}