import { isValidCpf } from '@/lib/utils';
import { authenticate } from '@/features/auth/services/auth';
import { CpfField } from '@/features/auth/components/cpf-field';
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
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

const formSchema = z.object({
  cpf: z
    .string()
    .min(11, { message: 'Por favor, insira seu CPF' })
    .refine((v) => isValidCpf(v), { message: 'CPF inválido' }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    form.clearErrors()
    setIsLoading(true);
    console.log('Submitting form with data:', data);

    const res = await authenticate(data.cpf, data.password);
    if (res.status === 'error') {
      setIsLoading(false);
      if (res.reason === 'cpf_not_found') {
        form.setError('cpf', { type: 'manual', message: 'CPF não encontrado.' });
        try {
          form.setFocus('cpf')
        } catch {}
        toast.error('CPF não encontrado.')
      } else if (res.reason === 'invalid_password') {
        form.setError('password', { type: 'manual', message: 'Senha incorreta.' });
        try {
          form.setFocus('password')
        } catch {}
        toast.error('Senha incorreta.')
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

    setIsLoading(false);
    const targetPath = redirectTo || '/';
    navigate({ to: targetPath, replace: true });
    toast.success(`Bem-vindo(a) de volta, ${user.email}!`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <CpfField control={form.control} name="cpf" />
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
      </form>
    </Form>
  );
}
