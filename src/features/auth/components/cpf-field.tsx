import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CpfInput } from '@/components/cpf-input'
import type { Control } from 'react-hook-form'

type CpfFieldProps = {
  control: Control<any>
  name: string
  label?: string
}

export function CpfField({ control, name, label = 'CPF' }: CpfFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <CpfInput placeholder="xxx.xxx.xxx-xx" {...field} />
          </FormControl>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  )
}