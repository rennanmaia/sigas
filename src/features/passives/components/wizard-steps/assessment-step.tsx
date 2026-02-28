import type { Control } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SelectDropdown } from '@/components/select-dropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { Liability } from '../../data/schema';

interface AssessmentStepProps {
  control: Control<Liability>;
}

export function AssessmentStep({ control }: AssessmentStepProps) {
  return (
    <div className="space-y-6">
      {/* Risco */}
      <FormField
        control={control}
        name="risco"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nível de Risco *</FormLabel>
            <div className="w-fit">
              <SelectDropdown
                className='w-full'
                defaultValue={field.value}
                onValueChange={field.onChange}
                items={[
                  { label: 'Baixo', value: 'Baixo' },
                  { label: 'Médio', value: 'Médio' },
                  { label: 'Alto', value: 'Alto' },
                  { label: 'Crítico', value: 'Crítico' },
                ]}
              />
            </div>
            <FormDescription>
              Avalie o nível de severidade do risco apresentado
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Impacto Ambiental */}
        <div>
            <FormField
                control={control}
                name="impactoAmbiental"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Impacto Ambiental *</FormLabel>
                    <div className="w-full">
                        <SelectDropdown
                            className='w-full'
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        items={[
                            { label: 'Leve', value: 'Leve' },
                            { label: 'Moderado', value: 'Moderado' },
                            { label: 'Significativo', value: 'Significativo' },
                            { label: 'Severo', value: 'Severo' },
                        ]}
                        />
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <div>
            <FormField
                control={control}
                name="impactoSocial"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Impacto Social *</FormLabel>
                    <div className="w-full">
                        <SelectDropdown
                            className='w-full'
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            items={[
                                { label: 'Leve', value: 'Leve' },
                                { label: 'Moderado', value: 'Moderado' },
                                { label: 'Significativo', value: 'Significativo' },
                                { label: 'Severo', value: 'Severo' },
                            ]}
                        />
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
      </div>

      {/* Tendência */}
      <FormField
        control={control}
        name="tendencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tendência *</FormLabel>
            <div className="w-fit">
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                items={[
                  { label: 'Piorando', value: 'subindo' },
                  { label: 'Melhorando', value: 'descendo' },
                  { label: 'Estável', value: 'estavel' },
                ]}
              />
            </div>
            <FormDescription>
              Como o passivo está evoluindo ao longo do tempo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contagem de Recorrências */}
      <FormField
        control={control}
        name="recorrenciaContagem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantas vezes este passivo foi identificado?</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3 p-4 bg-muted rounded-lg">
        {/* Recorrente */}
        <FormField
          control={control}
          name="recorrente"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Este é um problema recorrente
              </FormLabel>
            </FormItem>
          )}
        />

        {/* Não Conformidade */}
        <FormField
          control={control}
          name="naoConformidade"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Representa não conformidade com regulações
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
