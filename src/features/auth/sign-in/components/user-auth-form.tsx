import { authenticate } from '@/features/auth/services/auth';
import { useLoginAttempts } from "@/hooks/use-login-attempts";
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
  email: z.email({
    error: (issue) => (issue.input === '' ? 'Por favor, insira seu email' : 'Email inválido'),
  }),
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

    // Verifica se a conta está bloqueada
    if (loginAttempts.isAccountBlocked(data.email)) {
      setIsLoading(false);
      const warningMsg = loginAttempts.getWarningMessage(data.email);
      toast.error(warningMsg || 'Sua conta foi desativada. Entre em contato com o administrador.');
      return;
    }

    const res = await authenticate(data.email, data.password);
    if (res.status === 'error') {
      setIsLoading(false);
      if (res.reason === 'email_not_found') {
        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Usuário não autenticado',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Tentativa de login com email inexistente',
          details: `Falha de login: email ${data.email} não encontrado.`,
        });
        form.setError('email', { type: 'manual', message: 'Email não encontrado.' });
        try {
          form.setFocus('email')
        } catch {}
        toast.error('Email não encontrado.')
      } else if (res.reason === 'account_blocked') {
        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Usuário não autenticado',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Conta bloqueada',
          details: `Tentativa de login bloqueada para email ${data.email}`,
        });
        toast.error('Conta bloqueada. Entre em contato com o administrador.')
      } else if (res.reason === 'invalid_password') {
        // Registra a tentativa falha
        loginAttempts.recordFailedAttempt(data.email);
        const warningMsg = loginAttempts.getWarningMessage(data.email);
        
        useAuditStore.getState().addEvent({
          userId: 'anonymous',
          userName: 'Usuário não autenticado',
          action: 'outros',
          module: 'system',
          entityId: data.email,
          entityName: 'Tentativa de login com senha inválida',
          details: `Falha de login por senha inválida para email ${data.email}.`,
        });
        form.setError('password', { type: 'manual', message: 'Senha incorreta.' });
        try {
          form.setFocus('password')
        } catch {}
        toast.error('Senha incorreta.')
        
        // Mostra aviso se atingiu o limite de tentativas
        if (warningMsg) {
          toast.error(warningMsg);
        }
      }
      return;
    }

    const user = res.user;

    const mockUser = {
      accountNo: 'ACC001',
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };

    auth.setUser(mockUser);
    auth.setAccessToken('mock-access-token');

    // Reset das tentativas falhas em caso de sucesso
    loginAttempts.resetFailedAttempts(data.email);

    useAuditStore.getState().addEvent({
      userId: mockUser.accountNo,
      userName: mockUser.email,
      action: 'outros',
      module: 'system',
      entityId: mockUser.accountNo,
      entityName: 'Login realizado',
      details: `Login bem-sucedido para ${mockUser.email}`,
    });

    setIsLoading(false);
    const targetPath = redirectTo || '/';
    navigate({ to: targetPath, replace: true });
    toast.success(`Bem-vindo(a) de volta, ${user.email}!`);
  }

  const currentEmail = form.watch('email');
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
