import type { Control } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectDropdown } from '@/components/select-dropdown';
import { ResponsibleSelectDialog } from '@/features/projects/components/responsible-select-dialog';
import { users } from '@/features/users/data/users';
import type { Liability } from '../../data/schema';

const projectManagers = users
  .filter(
    (u) => u.status === "active" && u.roles.includes("project_administrator"),
  )
  .map((u) => ({
    label: `${u.firstName} ${u.lastName}`,
    value: `${u.firstName} ${u.lastName}`,
  }));


interface BasicInfoStepProps {
  control: Control<Liability>;
}

export function BasicInfoStep({ control }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
            <div>
                <FormField
                    control={control}
                    name="codigo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código Identificador *</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="PAS-ENV-001"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
                <FormField
                    control={control}
                    name="tipo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo *</FormLabel>
                            <SelectDropdown
                                className='w-full'
                                placeholder='Selecione um tipo'
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                items={[
                                    { label: 'Ambiental', value: 'Ambiental' },
                                    { label: 'Social', value: 'Social' },
                                ]}
                            />
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <FormField
            control={control}
            name="nome"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Nome do Passivo *</FormLabel>
                <FormControl>
                <Input
                    placeholder="Ex: Vazamento de óleo no tanque de armazenamento"
                    {...field}
                />
                </FormControl>
                <FormDescription>
                Descrição clara e concisa do passivo identificado
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-6">
            {/* Categoria */}
            <FormField
            control={control}
            name="categoria"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Ex: Resíduos, Segurança, Emissões"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            {/* Data de Identificação */}
            <FormField
            control={control}
            name="dataIdentificacao"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Data de Identificação *</FormLabel>
                <FormControl>
                    <Input
                        type="date"
                        {...field}
                        value={field.value.split('T')[0]}
                        onChange={(e) => {
                            const val = new Date(e.target.value).toISOString();
                            console.log("data", val);
                            field.onChange(val);
                        }}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        {/* Responsável */}
        <FormField
            control={control}
            name="responsavel"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Responsável pela Gestão *</FormLabel>
                <FormControl>
                    <ResponsibleSelectDialog 
                        value={field.value}
                        onSelect={field.onChange}
                        options={projectManagers}
                        placeholder="Selecione o(a) Responsável"
                    />
                </FormControl>
                <FormDescription>
                Quem será responsável pelas ações corretivas
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
    </div>
  );
}
