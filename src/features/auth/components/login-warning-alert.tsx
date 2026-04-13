import { AlertCircle } from "lucide-react";

interface LoginWarningAlertProps {
  message: string;
  isAccountSuspended?: boolean;
}

export function LoginWarningAlert({ message, isAccountSuspended = false }: LoginWarningAlertProps) {
  const bgColor = isAccountSuspended ? 'bg-red-100' : 'bg-red-50';
  const borderColor = isAccountSuspended ? 'border-red-400' : 'border-red-200';
  const textColor = 'text-red-700';
  
  return (
    <div className={`flex items-start gap-3 p-4 ${bgColor} border ${borderColor} rounded-md animate-in fade-in slide-in-from-top-2`}>
      <AlertCircle className={`h-5 w-5 ${textColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`${textColor} font-semibold text-sm`}>{message}</p>
      </div>
    </div>
  );
}
