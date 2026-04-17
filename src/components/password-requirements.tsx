import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordRequirementsProps = {
  password: string;
  className?: string;
};

const rules = [
  {
    id: "length",
    label: "Pelo menos 8 caracteres",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "Pelo menos 1 letra maiúscula",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "Pelo menos 1 letra minúscula",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "Pelo menos 1 número",
    test: (value: string) => /\d/.test(value),
  },
  {
    id: "symbol",
    label: "Pelo menos 1 símbolo",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

export function PasswordRequirements({
  password,
  className,
}: PasswordRequirementsProps) {
  const hasStartedTyping = password.trim().length > 0;

  if (!hasStartedTyping) {
    return null;
  }

  return (
    <div className={cn("rounded-md border bg-muted/30 p-3", className)}>
      <p className="text-xs font-medium">Sua senha deve conter:</p>
      <ul className="mt-2 space-y-1.5">
        {rules.map((rule) => {
          const isValid = rule.test(password);

          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-xs",
                isValid ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {isValid ? (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Circle className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
