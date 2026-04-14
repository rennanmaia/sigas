import { z } from "zod";
import { useForm } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { t as i18next } from "i18next";
import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { showSubmittedData } from "@/lib/show-submitted-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/date-picker";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, i18next("settings:account.form.name.validation.required"))
    .min(2, i18next("settings:account.form.name.validation.minLength"))
    .max(30, i18next("settings:account.form.name.validation.maxLength")),
  dob: z.date(),
  language: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: "",
};

export function AccountForm() {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data);
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("account.form.name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("account.form.name.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("account.form.name.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("account.form.dob.label")}</FormLabel>
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
                placeholder={t("account.form.dob.placeholder")}
              />
              <FormDescription>
                {t("account.form.dob.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("account.form.language.label")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value,
                          )?.label
                        : t("account.form.language.placeholder")}
                      <CaretSortIcon className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={t("account.form.language.searchPlaceholder")}
                    />
                    <CommandEmpty>
                      {t("account.form.language.notFound")}
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("language", language.value);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "size-4",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                {t("account.form.language.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("account.form.submit")}</Button>
      </form>
    </Form>

    <div className="border-t pt-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{t("changePassword.section.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("changePassword.section.description")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/change-password" })}
          className="gap-2"
        >
          <Lock className="h-4 w-4" />
          {t("changePassword.section.button")}
        </Button>
      </div>
    </div>
    </div>
  );
}
