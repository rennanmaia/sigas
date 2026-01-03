import * as React from "react";
import { cn } from "@/lib/utils";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(digits: string) {
  const d = digits.slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);

  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "-" + p4;
  return out;
}

function CpfInput({
  className,
  type = "text",
  value,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  const [internalValue, setInternalValue] = React.useState(() => {
    if (value === undefined || value === null) return "";
    return formatCpf(String(value));
  });

  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalValue(formatCpf(String(value)));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = onlyDigits(e.target.value).slice(0, 11);
    const masked = formatCpf(rawDigits);

    if (value === undefined) {
      setInternalValue(masked);
    }

    if (onChange) {
      try {
        onChange(rawDigits as any);
      } catch {
        onChange(e as any);
      }
    }
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      value={
        value === undefined || value === null
          ? internalValue
          : formatCpf(String(value))
      }
      onChange={handleChange}
      inputMode="numeric"
      // pattern="[0-9]*"
      {...props}
    />
  );
}

export { CpfInput };
