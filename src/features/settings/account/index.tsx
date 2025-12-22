import { ContentSection } from "../components/content-section";
import { AccountForm } from "./account-form";

export function SettingsAccount() {
  return (
    <ContentSection
      title="Conta"
      desc="Update your account settings. Set your preferred language and
          timezone."
    >
      <AccountForm />
    </ContentSection>
  );
}
