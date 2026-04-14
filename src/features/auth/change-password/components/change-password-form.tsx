import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/features/auth/services/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useAuditStore } from "@/stores/audit-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/password-input";

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Por favor, insira sua senha atual")
      .min(8, "A senha deve conter pelo menos 8 caracteres"),
    newPassword: z
      .string()
      .min(1, "Por favor, insira a nova senha")
      .min(8, "A nova senha deve conter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A senha deve conter letras maiúsculas, minúsculas e números"
      ),
    confirmPassword: z
      .string()
      .min(1, "Por favor, confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "A nova senha não pode ser igual à senha anterior",
    path: ["newPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  onSuccess?: () => void;
  showBackButton?: boolean;
  backTo?: "/settings/account" | "/settings/security";
}

export function ChangePasswordForm({
  onSuccess,
  showBackButton = true,
  backTo = "/settings/account",
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("settings");
  const { auth } = useAuthStore();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    form.clearErrors();
    setIsLoading(true);

    if (!auth?.user?.email) {
      setIsLoading(false);
      toast.error("Usuário não autenticado");
      navigate({ to: "/sign-in" });
      return;
    }

    const result = await changePassword(
      auth.user.email,
      data.oldPassword,
      data.newPassword
    );

    if (result.status === "error") {
      setIsLoading(false);

      if (result.reason === "invalid_old_password") {
        form.setError("oldPassword", {
          type: "manual",
          message: "Senha atual incorreta",
        });
        try {
          form.setFocus("oldPassword");
        } catch {}
        toast.error("Senha atual incorreta");
      } else if (result.reason === "user_not_found") {
        toast.error("Usuário não encontrado");
        navigate({ to: backTo });
      }

      useAuditStore.getState().addEvent({
        userId: auth.user.accountNo || "unknown",
        userName: auth.user.email,
        action: "outros",
        module: "system",
        entityId: auth.user.email,
        entityName: "Tentativa de alterar senha",
        details: `Falha ao alterar senha: ${result.reason}`,
      });
      return;
    }

    // Success
    form.reset();
    toast.success("Senha alterada com sucesso!");

    useAuditStore.getState().addEvent({
      userId: auth.user.accountNo || "unknown",
      userName: auth.user.email,
      action: "outros",
      module: "system",
      entityId: auth.user.email,
      entityName: "Alteração de senha",
      details: `Senha alterada com sucesso para a conta ${auth.user.email}`,
    });

    setTimeout(() => {
      navigate({ to: backTo });
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  }

  return (
    <div className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha atual:</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("changePassword.form.oldPassword.placeholder")}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha:</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("changePassword.form.newPassword.placeholder")}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha:</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("changePassword.form.confirmPassword.placeholder")}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={cn(
              "mt-6 flex w-full items-center gap-8",
              showBackButton ? "justify-between" : "justify-end"
            )}
          >
            {showBackButton && (
              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                onClick={() => navigate({ to: backTo })}
                className="gap-2 shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("changePassword.form.submitting")}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {t("changePassword.form.submit")}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
