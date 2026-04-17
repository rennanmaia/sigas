import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "@/features/auth/change-password/components/change-password-form";
import { Separator } from "@/components/ui/separator";
import { ContentSection } from "../components/content-section";
import { TwoFactorForm } from "./two-factor-form";

export function SettingsSecurity() {
  const { t } = useTranslation("settings");

  return (
    <ContentSection title={t("security.title")} desc={t("security.description")}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium">{t("changePassword.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("changePassword.description")}</p>
          <div className="mt-4">
            <ChangePasswordForm showBackButton={false} backTo="/settings/security" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{t("security.twoFactor.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("security.twoFactor.description")}</p>
          </div>
          <TwoFactorForm />
        </div>
      </div>
    </ContentSection>
  );
}
