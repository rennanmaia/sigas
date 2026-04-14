import { authenticate } from '@/features/auth/services/auth';
import { useLoginAttempts } from '@/hooks/use-login-attempts';
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor, insira seu e-mail' })
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(1, 'Por favor insira sua senha')
    .min(8, 'A senha deve conter pelo menos 8 caracteres'),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const loginAttempts = useLoginAttempts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    form.clearErrors()
    setIsLoading(true);
    console.log('Submitting form with data:', data);

    if (loginAttempts.isAccountBlocked(data.email)) {
      setIsLoading(false);
      const warning = loginAttempts.getWarningMessage(data.email);
      toast.error(warning || 'Sua conta foi desativada. Entre em contato com o administrador.');
      return;
    }

    const res = await authenticate(data.email, data.password);
    if (res.status === 'error') {
      setIsLoading(false);
      if (res.reason === 'email_not_found') {
        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Sistema',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Tentativa de login com e-mail inexistente',
          details: `Falha de login: e-mail ${data.email} não encontrado.`,
        });
        form.setError('email', { type: 'manual', message: 'E-mail não encontrado.' });
        try {
          form.setFocus('email')
        } catch {}
        toast.error('E-mail não encontrado.')
      } else if (res.reason === 'account_blocked') {
        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Sistema',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Conta bloqueada',
          details: `Tentativa de login bloqueada para e-mail ${data.email}`,
        });
        toast.error('Conta bloqueada. Entre em contato com o administrador.')
      } else if (res.reason === 'invalid_password') {
        const wasBlockedBefore = loginAttempts.isAccountBlocked(data.email);
        loginAttempts.recordFailedAttempt(data.email);
        const warningMsg = loginAttempts.getWarningMessage(data.email);
        const isBlockedNow = loginAttempts.isAccountBlocked(data.email);

        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Sistema',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Tentativa de login com senha inválida',
          details: `Falha de login por senha inválida para e-mail ${data.email}.`,
        });
        form.setError('password', { type: 'manual', message: 'Senha incorreta.' });
        try {
          form.setFocus('password')
        } catch {}
        toast.error('Senha incorreta.')

        if (warningMsg) {
          toast.error(warningMsg);
        }

        if (!wasBlockedBefore && isBlockedNow) {
          useAuditStore.getState().addEvent({
            userId: 'anonymous',
            userName: 'Sistema',
            action: 'outros',
            module: 'system',
            entityId: data.email,
            entityName: 'Bloqueio de conta',
            details: `Bloqueio automático por excesso de tentativas para o e-mail ${data.email}.`,
          });
        }
      }
      return;
    }

    const user = res.user;
  const normalizedEmail = data.email.trim().toLowerCase();
    const storedUsersRaw = localStorage.getItem('local-users');

    let userId = 'ACC001';
    let userName = user.email;

    if (storedUsersRaw) {
      try {
        const users = JSON.parse(storedUsersRaw) as Array<{
          id?: string;
          email?: string;
          firstName?: string;
          lastName?: string;
          username?: string;
        }>;
        const matched = users.find(
          (item) => String(item.email ?? '').trim().toLowerCase() === normalizedEmail,
        );

        if (matched) {
          userId = matched.id || userId;
          const fullName = `${matched.firstName || ''} ${matched.lastName || ''}`.trim();
          userName = fullName || matched.username || user.email;
        }
      } catch {
        // Keep login resilient even if local user cache is malformed.
      }
    }

    const mockUser = {
      accountNo: userId,
      name: userName,
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };

    auth.setUser(mockUser);
    auth.setAccessToken('mock-access-token');

    loginAttempts.resetFailedAttempts(data.email);

    useAuditStore.getState().addEvent({
      userId: mockUser.accountNo,
      userName: mockUser.name,
      action: 'outros',
      module: 'system',
      entityId: mockUser.email,
      entityName: mockUser.email,
      details: `Login bem-sucedido para ${mockUser.email}`,
    });

    setIsLoading(false);
    const targetPath = redirectTo || '/';
    navigate({ to: targetPath, replace: true });
    toast.success(`Bem-vindo(a) de volta, ${user.email}!`);
  }

  const currentEmail = String(form.watch('email') || '');
  const warningMsg = loginAttempts.getWarningMessage(currentEmail) || '';
  const showWarning = loginAttempts.isWarningVisible(currentEmail);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="usuario@sigas.com" {...field} />
              </FormControl>
              <FormMessage className="mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
                <FormMessage className="mt-1" />
              <Link
                to="/forgot-password"
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                Esqueceu sua senha?
              </Link>
            </FormItem>
          )}
        />
        <Button type='submit' className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Entrar
        </Button>

        {showWarning && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 font-medium">{warningMsg}</p>
          </div>
        )}
      </form>
    </Form>
  );
}
