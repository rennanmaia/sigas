import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDropdown } from "@/components/select-dropdown";
import { projectFormSchema, type ProjectForm } from "../data/schema";
import { users } from "@/features/users/data/users";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { ResponsibleSelectDialog } from "./responsible-select-dialog";

interface ProjectFormProps {
  onSubmit: (values: ProjectForm) => void;
  submitLabel: string;
  initialData?: any;
}

const projectManagers = users
  .filter(
    (u) => u.status === "active" && u.roles.includes("project_administrator"),
  )
  .map((u) => ({
    label: `${u.firstName} ${u.lastName}`,
    value: `${u.firstName} ${u.lastName}`,
  }));

export default function ProjectForm({
  onSubmit,
  submitLabel,
  initialData,
}: ProjectFormProps) {
  const navigate = useNavigate();

  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: "Ambiental",
      startDate: "",
      endDate: "",
      responsible: "",
      budget: 0,
      company: "",
      customFields: [],
      forms: [],
      members: [],
    },
    values: initialData
      ? {
          ...initialData,
          company: initialData.company || "",
          customFields: initialData.customFields || [],
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFields",
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Título do Projeto
                </FormLabel>
                <FormControl className="col-span-4">
                  <Input placeholder="Ex: Monitoramento de Fauna" {...field} />
                </FormControl>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Categoria
                </FormLabel>
                <div className="col-span-4 w-fit min-w-[150px]">
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={[
                      { label: "Ambiental", value: "Ambiental" },
                      { label: "Social", value: "Social" },
                    ]}
                  />
                </div>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Empresa Responsável
                </FormLabel>
                <FormControl className="col-span-4">
                  <Input
                    placeholder="Nome da empresa parceira ou cliente"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Responsável Técnico
                </FormLabel>
                <div className="col-span-4">
                  <ResponsibleSelectDialog
                    value={field.value}
                    onSelect={field.onChange}
                    options={projectManagers}
                    placeholder="Selecione o(a) Responsável"
                  />
                </div>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Data de Início
                </FormLabel>
                <FormControl className="col-span-4">
                  <Input type="date" className="w-fit" {...field} />
                </FormControl>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => {
              const startDate = form.watch("startDate");
              return (
                <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                  <FormLabel className="col-span-2 text-end font-medium">
                    Data de Término
                  </FormLabel>
                  <FormControl className="col-span-4">
                    <Input
                      type="date"
                      className="w-fit"
                      min={startDate || undefined}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Orçamento (R$)
                </FormLabel>
                <FormControl className="col-span-4">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t border-dashed">
            <div className="grid grid-cols-6 gap-x-4 items-center">
              <div className="col-span-2 text-end">
                <FormLabel className="font-medium">
                  Campos Extras (opcional){" "}
                </FormLabel>
              </div>
              <div className="col-span-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => append({ label: "", value: "" })}
                >
                  <Plus size={14} /> Adicionar Informação
                </Button>
              </div>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-6 gap-x-4 items-start"
              >
                <div className="col-span-2 flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <div className="col-span-4 grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Título (ex: ID Externo)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Valor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 pt-2">
                <FormLabel className="col-span-2 text-end font-medium pt-2">
                  Descrição
                </FormLabel>
                <FormControl className="col-span-4">
                  <Textarea
                    className="resize-none h-32"
                    placeholder="Detalhes..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-3" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: ".." })}
          >
            Cancelar
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
