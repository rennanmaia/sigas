import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthLayout } from "../auth-layout";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Esqueci minha senha
          </CardTitle>
          <CardDescription>
            Insira seu email cadastrado no sistema e um
            <br /> link será enviado para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground mx-auto px-8 text-center text-sm text-balance">
            Não possui uma conta?{" "}
            <Link
              to="/sign-up"
              className="hover:text-primary underline underline-offset-4"
            >
              Criar conta
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
