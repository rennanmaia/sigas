import { useForm } from "react-hook-form";
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
import { projectTeam } from "../data/projects-mock";
import { useNavigate } from "@tanstack/react-router";
interface ProjectFormProps {
  onSubmit: (values: ProjectForm) => void;
  submitLabel: string;
  initialData?: any;
}

export default function ProjectForm({
  onSubmit,
  submitLabel,
  initialData,
}: ProjectFormProps) {
  const navigate = useNavigate();
  const managerOptions = projectTeam
    .filter((m) => m.role.toLowerCase().includes("gerente"))
    .map((m) => ({
      label: m.name,
      value: m.name,
    }));

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
      forms: [],
      members: [],
    },

    values: initialData
      ? {
          title: initialData.title || "",
          description: initialData.description || "",
          category: initialData.category || "Ambiental",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          responsible: initialData.responsible || "",
          budget: initialData.budget || 0,
          forms: initialData.forms || [],
          members: initialData.members || [],
        }
      : undefined,
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
            name="responsible"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Responsável Técnico
                </FormLabel>
                <div className="col-span-4">
                  <SelectDropdown
                    key={field.value}
                    placeholder="Selecione o(a) Responsável"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={managerOptions}
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
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4">
                <FormLabel className="col-span-2 text-end font-medium">
                  Data de Término
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
                    placeholder="Detalhes sobre as atividades..."
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
            className="px-6"
          >
            Cancelar
          </Button>
          <Button type="submit" className="px-10">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
