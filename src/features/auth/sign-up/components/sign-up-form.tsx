import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === "" ? "Por favor insira seu Email" : undefined,
    }),
    password: z
      .string()
      .min(1, "Por favor insira sua Senha")
      .min(7, "A senha deve conter no mínimo 7 caracteres"),
    confirmPassword: z.string().min(1, "Por favor confirme a sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const stored = localStorage.getItem('auth-users');
      const users = stored
        ? (JSON.parse(stored) as Array<{ email: string; password: string; status?: string; role?: string[] }>)
        : [];

      const normalizedEmail = data.email.trim().toLowerCase();
      const alreadyExists = users.some((user) => user.email.trim().toLowerCase() === normalizedEmail);

      if (alreadyExists) {
        form.setError('email', { type: 'manual', message: 'Este email já está cadastrado.' });
        toast.error('Este email já está cadastrado.');
        setIsLoading(false);
        return;
      }

      users.push({
        email: normalizedEmail,
        password: data.password,
        status: 'active',
        role: ['general_administrator'],
      });

      localStorage.setItem('auth-users', JSON.stringify(users));

      toast.success('Cadastro finalizado com sucesso! Faça login para continuar.');
      form.reset();
      navigate({ to: '/sign-in' });
    } catch {
      toast.error('Não foi possível finalizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="usuario@sigas.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
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
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}
