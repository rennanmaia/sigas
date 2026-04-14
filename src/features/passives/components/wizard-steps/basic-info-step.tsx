import { useState, type KeyboardEvent } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectDropdown } from "@/components/select-dropdown";
import type { Liability } from "../../data/schema";
import { Plus, Trash2, X } from "lucide-react";
import { LocationPickerField } from "./location-picker-field";

interface BasicInfoStepProps {
  control: Control<Liability>;
}

export function BasicInfoStep({ control }: BasicInfoStepProps) {
  const [tagInput, setTagInput] = useState("");
  const {
    fields: customFields,
    append: appendCustomField,
    remove: removeCustomField,
  } = useFieldArray({ control, name: "customFields" });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código Identificador *</FormLabel>
              <FormControl>
                <Input placeholder="PAS-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <SelectDropdown
                className="w-full"
                placeholder="Selecione o status"
                defaultValue={field.value}
                onValueChange={field.onChange}
                items={[
                  { label: "Ativo", value: "Ativo" },
                  { label: "Inativo", value: "Inativo" },
                  { label: "Indisponível", value: "Indisponível" },
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />
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

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="descricao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva em detalhes o passivo, contexto e impactos esperados..."
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="tipo"
          render={({ field }) => {
            const tags: string[] = Array.isArray(field.value)
              ? field.value
              : [];

            const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const trimmed = tagInput.trim();
                if (trimmed && tags.length < 3 && !tags.includes(trimmed)) {
                  field.onChange([...tags, trimmed]);
                  setTagInput("");
                }
              }
            };

            const removeTag = (tag: string) => {
              field.onChange(tags.filter((t) => t !== tag));
            };

            return (
              <FormItem>
                <FormLabel>Tags</FormLabel>

                <div className="space-y-2">
                  <FormControl>
                    <Input
                      placeholder="Ex: Ambiental, Hídrico..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={tags.length >= 3}
                    />
                  </FormControl>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="rounded-sm opacity-70 hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />

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
                  value={field.value.split("T")[0]}
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value).toISOString());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <LocationPickerField control={control} />

      {/* Campos Personalizados */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <FormLabel className="text-base">Campos Personalizados</FormLabel>
            <p className="text-sm text-muted-foreground">
              Adicione informações extras com Título e Valor.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => appendCustomField({ label: "", value: "" })}
          >
            <Plus className="h-4 w-4" /> Adicionar campo
          </Button>
        </div>

        {customFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <FormField
                control={control}
                name={`customFields.${index}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Título (ex: ID Externo)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-destructive shrink-0"
              onClick={() => removeCustomField(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {customFields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhum campo personalizado adicionado.
          </p>
        )}
      </div>
    </div>
  );
}
