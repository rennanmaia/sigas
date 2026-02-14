import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailPlus, Send } from "lucide-react";
import { isValidCpf } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CheckIcon, CaretSortIcon } from '@radix-ui/react-icons'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Checkbox not used; replaced with Command multi-select
import { CpfInput } from '@/components/cpf-input'
import { Textarea } from "@/components/ui/textarea";
// SelectDropdown not used here; using Popover + Command for scalable multi-select
import { roles } from "../data/data";
import { type User } from '../data/schema'
import { useUsersStore } from "@/stores/users-store";
import { useTranslation } from "react-i18next";
import { t as i18next } from "i18next";

const formSchema = z.object({
  cpf: z.string().min(1, i18next("users:create.form.cpf.validation.required")).refine((v) => isValidCpf(v), { message: i18next("users:create.form.cpf.validation.invalid") }),
  fullName: z.string().min(1, i18next("users:create.form.fullname.validation.required")),
  email: z.email({ error: (iss) => (iss.input === '' ? i18next("users:create.form.email.validation.invalid") : undefined) }),
  roles: z.array(z.string()).min(1, i18next("users:create.form.roles.validation.required")),
  desc: z.string().optional(),
})

type UserInviteForm = z.infer<typeof formSchema>

type UserInviteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UsersInviteDialog({
  open,
  onOpenChange,
}: UserInviteDialogProps) {
  const { t } = useTranslation("users")
  const { users, setUsers } = useUsersStore();

  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { cpf: '', fullName: '', email: '', roles: [], desc: '' },
  });

  const onSubmit = (values: UserInviteForm) => {
    // create invited user record
    const [firstName, ...rest] = values.fullName.split(' ')
    const lastName = rest.join(' ')
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      username: values.email.split('@')[0],
      email: values.email,
      phoneNumber: '',
      cpf: values.cpf.replace(/\D/g, ''),
      status: 'invited',
      roles: values.roles as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers([newUser, ...users])
    form.reset()
    onOpenChange(false)
    toast.success(t("create.submit.message"))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            <MailPlus /> {t("create.title")}
          </DialogTitle>
          <DialogDescription>
            {t("create.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-invite-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField control={form.control} name="cpf" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.form.cpf.label")}</FormLabel>
                <FormControl>
                  <CpfInput placeholder={t("create.form.cpf.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fullName" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.form.fullname.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("create.form.fullname.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.form.email.label")}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t("create.form.email.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("create.form.roles.label")}</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value?.length && 'text-muted-foreground'
                          )}
                        >
                          <span className="block w-full text-left truncate">
                            {(() => {
                              const selected = roles.filter((r) => (field.value ?? []).includes(r.value)).map((r) => r.label)
                              if (!selected.length) return t("create.form.roles.selectionPlaceholder")
                              if (selected.length <= 2) return selected.join(', ')
                              return `${selected[0]} +${selected.length - 1}`
                            })()}
                          </span>
                          <CaretSortIcon className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder={t("create.form.roles.placeholder")} />
                        <CommandEmpty>{t("create.form.roles.notFound")}</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {roles.map((r) => (
                              <CommandItem
                                key={r.value}
                                value={r.value}
                                onSelect={() => {
                                  const has = field.value?.includes(r.value);
                                  const next = has
                                    ? field.value.filter((v: string) => v !== r.value)
                                    : [...(field.value ?? []), r.value];
                                  field.onChange(next);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'size-4',
                                    field.value?.includes(r.value) ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                {r.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>{t("create.form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder={t("create.form.description.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">{t("create.actions.cancel")}</Button>
          </DialogClose>
          <Button type="submit" form="user-invite-form">
            {t("create.actions.create")} <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
