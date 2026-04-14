import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "../auth-layout";
import { ChangePasswordForm } from "./components/change-password-form";

export function ChangePassword() {
  const { t } = useTranslation("settings");

  return (
    <AuthLayout>
      <div className="space-y-6 w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("changePassword.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("changePassword.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("changePassword.form.title")}</CardTitle>
            <CardDescription>
              {t("changePassword.form.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
