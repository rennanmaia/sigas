import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  resetPassword,
  RESET_PASSWORD_EMAIL_KEY,
} from "@/features/auth/services/auth";
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

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, "Por favor, insira sua nova senha")
      .min(8, "A senha deve conter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A senha deve conter letras maiúsculas, minúsculas e números",
      ),
    confirmPassword: z.string().min(1, "Por favor, confirme sua nova senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const email = String(localStorage.getItem(RESET_PASSWORD_EMAIL_KEY) ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      setIsLoading(false);
      toast.error("Sessão de recuperação expirada. Inicie novamente.");
      navigate({ to: "/forgot-password" });
      return;
    }

    const result = await resetPassword(email, data.password);

    if (result.status === "error") {
      setIsLoading(false);
      toast.error("Usuário não encontrado para redefinição de senha.");
      return;
    }

    localStorage.removeItem(RESET_PASSWORD_EMAIL_KEY);
    form.reset();

    useAuditStore.getState().addEvent({
      userId: "anonymous",
      userName: "Sistema",
      action: "outros",
      module: "system",
      entityId: email,
      entityName: "Redefinição de senha",
      details: result.reactivated
        ? `Senha redefinida e conta reativada automaticamente para ${email}.`
        : `Senha redefinida com sucesso para ${email}.`,
    });

    toast.success(
      result.reactivated
        ? "Senha redefinida e conta reativada com sucesso!"
        : "Senha redefinida com sucesso!",
    );

    setIsLoading(false);
    navigate({ to: "/sign-in" });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
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
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-2" type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
          Redefinir senha
        </Button>
      </form>
    </Form>
  );
}
