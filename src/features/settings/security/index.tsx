import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "@/features/auth/change-password/components/change-password-form";
import { ContentSection } from "../components/content-section";

export function SettingsSecurity() {
  const { t } = useTranslation("settings");

  return (
    <ContentSection title={t("security.title")} desc={t("security.description")}>
      <ChangePasswordForm showBackButton={false} backTo="/settings/security" />
    </ContentSection>
  );
}
