import { authenticate } from '@/features/auth/services/auth';
import { useLoginAttempts } from '@/hooks/use-login-attempts';
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";

const REMEMBER_ME_STORAGE_KEY = "auth-remember-me";
const REMEMBER_ME_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type RememberedSession = {
  accountNo: string;
  name: string;
  email: string;
  role: string[];
  exp: number;
  rememberUntil: number;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor, insira seu e-mail' })
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(1, 'Por favor insira sua senha')
    .min(8, 'A senha deve conter pelo menos 8 caracteres'),
  rememberMe: z.boolean(),
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
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (auth.accessToken) return;

    const rawRemembered = localStorage.getItem(REMEMBER_ME_STORAGE_KEY);
    if (!rawRemembered) return;

    try {
      const remembered = JSON.parse(rawRemembered) as RememberedSession;

      if (!remembered?.email || !remembered?.rememberUntil) {
        localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
        return;
      }

      if (remembered.rememberUntil < Date.now()) {
        localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
        return;
      }

      auth.setUser({
        accountNo: remembered.accountNo,
        name: remembered.name,
        email: remembered.email,
        role: remembered.role,
        exp: remembered.exp,
      });
      auth.setAccessToken('mock-access-token', true);

      useAuditStore.getState().addEvent({
        userId: remembered.accountNo,
        userName: remembered.name,
        action: 'outros',
        module: 'system',
        entityId: remembered.email,
        entityName: remembered.email,
        details: `Login automático via Lembre-se de mim para ${remembered.email}`,
      });

      const targetPath = redirectTo || '/';
      navigate({ to: targetPath, replace: true });
      toast.success(`Bem-vindo(a) de volta, ${remembered.email}!`);
    } catch {
      localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
    }
  }, [auth, navigate, redirectTo]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    form.clearErrors()
    setIsLoading(true);
    console.log('Submitting form with data:', data);

    if (loginAttempts.isAccountBlocked(data.email)) {
      setIsLoading(false);
      const warning = loginAttempts.getWarningMessage(data.email);
      toast.error(warning || 'Sua conta foi desativada. Faça uma redefinição de senha para reativá-la.');
      return;
    }

    const res = await authenticate(data.email, data.password);
    if (res.status === 'error') {
      setIsLoading(false);
      if (res.reason === 'account_blocked') {
        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Sistema',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Conta bloqueada',
          details: `Tentativa de login bloqueada para e-mail ${data.email}`,
        });
        toast.error('Conta bloqueada. Faça uma redefinição de senha para reativá-la.')
      } else {
        const genericInvalidCredentialsMessage = 'Senha ou email incorreto'
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
          entityName: 'Tentativa de login inválida',
          details: `Falha de login para e-mail ${data.email}: ${res.reason}.`,
        });
        form.setError('password', { type: 'manual', message: genericInvalidCredentialsMessage });
        try {
          form.setFocus('password')
        } catch {}
        toast.error(genericInvalidCredentialsMessage)

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

    if (data.rememberMe) {
      const rememberedSession: RememberedSession = {
        ...mockUser,
        rememberUntil: Date.now() + REMEMBER_ME_TTL_MS,
      };
      localStorage.setItem(REMEMBER_ME_STORAGE_KEY, JSON.stringify(rememberedSession));
    } else {
      localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
    }

    auth.setAccessToken('mock-access-token', data.rememberMe === true);

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
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              </FormControl>
              <FormLabel className="font-normal">Lembre-se de mim</FormLabel>
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
