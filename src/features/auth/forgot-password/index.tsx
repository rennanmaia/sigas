import {
  Card,
  CardContent,
  CardDescription,
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
      </Card>
    </AuthLayout>
  );
}
