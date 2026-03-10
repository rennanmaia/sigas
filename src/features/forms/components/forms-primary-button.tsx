import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FileText, History } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTranslation } from "react-i18next";

export function FormsPrimaryButtons() {
  const { auth } = useAuthStore();
  const roles = auth.user?.role ?? [];
  const { t } = useTranslation("forms");

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="space-x-0" asChild>
        <Link to={"/forms/logs" as any}>
          <History size={18} />
          <span>{t("list.buttons.logs")}</span>
        </Link>
      </Button>
      {(roles.includes("general_administrator") || roles.includes("project_administrator")) && (
        <Button className="space-x-1" asChild>
          <Link to="/forms/create">
            <span>{t("list.buttons.add")}</span> <FileText size={18} />
          </Link>
        </Button>
      )}
    </div>
  );
}
