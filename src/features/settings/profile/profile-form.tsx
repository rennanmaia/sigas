import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { t as i18next } from "i18next";
import { Link } from "@tanstack/react-router";
import { showSubmittedData } from "@/lib/show-submitted-data";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileFormSchema = z.object({
  username: z
    .string(i18next("settings:profile.form.name.validation.required"))
    .min(2, i18next("settings:profile.form.name.validation.invalid"))
    .max(30, i18next("settings:profile.form.name.validation.maxLength")),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? i18next("settings:profile.form.email.validation.invalid")
        : undefined,
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { t } = useTranslation("settings");
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.form.name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("profile.form.name.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("profile.form.name.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.form.email.label")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("profile.form.email.selectPlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t("profile.form.email.description")}{" "}
                <Link to="/">{t("profile.form.email.descriptionLink")}</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("profile.form.submit")}</Button>
      </form>
    </Form>
  );
}
