import { Link, useSearch } from "@tanstack/react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthLayout } from "../auth-layout";
import { UserAuthForm } from "./components/user-auth-form";

export function SignIn() {
  const { redirect } = useSearch({ from: "/(auth)/sign-in" });

  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground mx-auto px-8 text-center text-sm text-balance">
            Não tem uma conta?{" "}
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
