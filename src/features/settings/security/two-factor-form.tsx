import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type TwoFactorSettings = {
  emailEnabled: boolean;
  appEnabled: boolean;
};

const codeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Código inválido");

const STORAGE_KEY = "settings-security-2fa";

export function TwoFactorForm() {
  const { t } = useTranslation("settings");

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [appEnabled, setAppEnabled] = useState(false);

  const [emailPending, setEmailPending] = useState(false);
  const [appPending, setAppPending] = useState(false);

  const [emailCode, setEmailCode] = useState("");
  const [appCode, setAppCode] = useState("");

  const appSecret = useMemo(() => "SIGAS-2FA-SECRET-4F9D-A1B3", []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as TwoFactorSettings;
      setEmailEnabled(Boolean(parsed.emailEnabled));
      setAppEnabled(Boolean(parsed.appEnabled));
    } catch {
      // Keep defaults if cache is malformed.
    }
  }, []);

  function persist(next: TwoFactorSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleToggleEmail(checked: boolean) {
    if (!checked) {
      setEmailEnabled(false);
      setEmailPending(false);
      setEmailCode("");
      persist({ emailEnabled: false, appEnabled });
      toast.success(t("security.twoFactor.email.disableSuccess"));
      return;
    }

    setEmailPending(true);
    setEmailCode("");
    toast.info(t("security.twoFactor.email.codeSent"));
  }

  function handleToggleApp(checked: boolean) {
    if (!checked) {
      setAppEnabled(false);
      setAppPending(false);
      setAppCode("");
      persist({ emailEnabled, appEnabled: false });
      toast.success(t("security.twoFactor.app.disableSuccess"));
      return;
    }

    setAppPending(true);
    setAppCode("");
    toast.info(t("security.twoFactor.app.setupHint"));
  }

  function confirmEmailCode() {
    const parsed = codeSchema.safeParse(emailCode);
    if (!parsed.success) {
      toast.error(t("security.twoFactor.invalidCode"));
      return;
    }

    setEmailEnabled(true);
    setEmailPending(false);
    setEmailCode("");
    persist({ emailEnabled: true, appEnabled });
    toast.success(t("security.twoFactor.email.enableSuccess"));
  }

  function confirmAppCode() {
    const parsed = codeSchema.safeParse(appCode);
    if (!parsed.success) {
      toast.error(t("security.twoFactor.invalidCode"));
      return;
    }

    setAppEnabled(true);
    setAppPending(false);
    setAppCode("");
    persist({ emailEnabled, appEnabled: true });
    toast.success(t("security.twoFactor.app.enableSuccess"));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <h3 className="text-base font-medium">{t("security.twoFactor.email.title")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("security.twoFactor.email.description")}
            </p>
          </div>
          <Switch checked={emailEnabled || emailPending} onCheckedChange={handleToggleEmail} />
        </div>

        {emailPending && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {t("security.twoFactor.email.verificationHint")}
            </p>
            <div className="flex gap-3">
              <Input
                value={emailCode}
                onChange={(event) => setEmailCode(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                placeholder={t("security.twoFactor.codePlaceholder")}
                className="max-w-[220px]"
              />
              <Button type="button" onClick={confirmEmailCode}>
                {t("security.twoFactor.confirmCode")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <h3 className="text-base font-medium">{t("security.twoFactor.app.title")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("security.twoFactor.app.description")}
            </p>
          </div>
          <Switch checked={appEnabled || appPending} onCheckedChange={handleToggleApp} />
        </div>

        {appPending && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="rounded-md bg-muted p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4" />
                {t("security.twoFactor.app.secretLabel")}
              </div>
              <code className="text-xs sm:text-sm">{appSecret}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("security.twoFactor.app.verificationHint")}
            </p>
            <div className="flex gap-3">
              <Input
                value={appCode}
                onChange={(event) => setAppCode(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                placeholder={t("security.twoFactor.codePlaceholder")}
                className="max-w-[220px]"
              />
              <Button type="button" onClick={confirmAppCode}>
                {t("security.twoFactor.confirmCode")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
