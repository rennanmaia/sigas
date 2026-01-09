import { roles } from "../data/data";

export default function UserRolesBadge({ userRoles }: { userRoles: string[] }) {
    if (userRoles.length === 0) return null;

    const [primary, ...rest] = userRoles;
    const userType = roles.find(({ value }) => value === primary);

    return (
        <div className="flex items-center gap-x-2">
            <span className="text-sm capitalize inline-flex items-center gap-2">
            {userType?.icon && <userType.icon size={14} className="text-muted-foreground" />}
            {userType?.label ?? primary}
            </span>

            {rest.length > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{rest.length}
            </span>
            )}
        </div>
    );
}