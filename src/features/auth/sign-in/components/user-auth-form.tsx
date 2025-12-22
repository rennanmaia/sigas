// import { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate } from "@tanstack/react-router";
// import { Loader2, LogIn } from "lucide-react";
// import { toast } from "sonner";
// import { useAuthStore } from "@/stores/auth-store";
// import { sleep, cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { PasswordInput } from "@/components/password-input";
// import { CpfInput } from "@/components/cpf-input";

// // CPF validation helper (accepts only digits string)
// // function isValidCpf(value: string) {
// //   const digits = String(value).replace(/\D/g, "");
// //   if (digits.length !== 11) return false;
// //   // Reject known invalid CPFs with all digits equal
// //   if (/^(\d)\1{10}$/.test(digits)) return false;

// //   const nums = digits.split("").map((d) => parseInt(d, 10));

// //   const calc = (sliceLen: number) => {
// //     let sum = 0;
// //     for (let i = 0; i < sliceLen; i++) {
// //       sum += nums[i] * (sliceLen + 1 - i);
// //     }
// //     const res = (sum * 10) % 11;
// //     return res === 10 ? 0 : res;
// //   };

// //   const v1 = calc(9);
// //   const v2 = calc(10);
// //   return v1 === nums[9] && v2 === nums[10];
// // }

// const formSchema = z.object({
//   email: z
//     .string()
//     .email({
//       message: "Please enter a valid email",
//     })
//     .refine((v) => v !== "", {
//       message: "Please enter your email",
//     }),
//   // cpf: z
//   //   .string()
//   //   .min(1, { message: "Por favor, insira seu CPF" })
//   //   .refine((v) => isValidCpf(v), { message: "CPF inválido" }),
//   password: z
//     .string()
//     .min(1, "Please enter your password")
//     .min(7, "Password must be at least 7 characters long"),
// });

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
//   redirectTo?: string;
// }

// export function UserAuthForm({
//   className,
//   redirectTo,
//   ...props
// }: UserAuthFormProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { auth } = useAuthStore();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       cpf: "",
//       password: "",
//     },
//   });

//   function onSubmit(data: z.infer<typeof formSchema>) {
//     setIsLoading(true);

//     toast.promise(sleep(2000), {
//       loading: "Entrando no sistema...",
//       success: () => {
//         setIsLoading(false);

//         // Mock successful authentication with expiry computed at success time
//         const mockUser = {
//           accountNo: "ACC001",
//           email: data.email,
//           role: ["user"],
//           exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
//         };

//         // Set user and access token
//         auth.setUser(mockUser);
//         auth.setAccessToken("mock-access-token");

//         // Redirect to the stored location or default to dashboard
//         const targetPath = redirectTo || "/";
//         navigate({ to: targetPath, replace: true });

//         return `Bem-vindo(a) de volta, ${data.email}!`;
//       },
//       error: "Error",
//     });
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className={cn("grid gap-3", className)}
//         {...props}
//       >
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="usuario@sigas.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/*<FormField
//           control={form.control}
//           name="cpf"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>CPF</FormLabel>
//               <FormControl>
//                 <CpfInput placeholder="xxx.xxx.xxx-xx" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />*/}
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem className="relative">
//               <FormLabel>Senha</FormLabel>
//               <FormControl>
//                 <PasswordInput placeholder="********" {...field} />
//               </FormControl>
//               <FormMessage />
//               <Link
//                 to="/forgot-password"
//                 className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
//               >
//                 Esqueceu sua senha?
//               </Link>
//             </FormItem>
//           )}
//         />
//         <Button className="mt-2" disabled={isLoading}>
//           {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
//           Entrar
//         </Button>
//       </form>
//     </Form>
//   );
// }

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { IconFacebook, IconGithub } from "@/assets/brand-icons";
import { useAuthStore } from "@/stores/auth-store";
import { sleep, cn } from "@/lib/utils";
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

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === "" ? "Por favor insira seu email" : undefined,
  }),
  password: z
    .string()
    .min(1, "Por favor insira sua senha")
    .min(8, "A senha deve conter pelo menos 8 caracteres"),
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
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    toast.promise(sleep(2000), {
      loading: "Entrando...",
      success: () => {
        setIsLoading(false);

        // Mock successful authentication with expiry computed at success time
        const mockUser = {
          accountNo: "ACC001",
          email: data.email,
          role: ["user"],
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };

        // Set user and access token
        auth.setUser(mockUser);
        auth.setAccessToken("mock-access-token");

        // Redirect to the stored location or default to dashboard
        const targetPath = redirectTo || "/";
        navigate({ to: targetPath, replace: true });

        return `Bem-vindo(a) de volta, ${data.email}!`;
      },
      error: "Error",
    });
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
            <FormItem className="relative">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to="/forgot-password"
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                Esqueceu sua senha?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Entrar
        </Button>
      </form>
    </Form>
  );
}
