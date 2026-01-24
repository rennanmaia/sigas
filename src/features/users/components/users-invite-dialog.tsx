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

const formSchema = z.object({
  cpf: z.string().min(1, 'Please enter CPF').refine((v) => isValidCpf(v), { message: 'Invalid CPF' }),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email({ error: (iss) => (iss.input === '' ? 'Please enter an email to invite.' : undefined) }),
  roles: z.array(z.string()).min(1, 'At least one profile is required'),
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
    toast.success('Invitation sent. An email has been dispatched with next steps.')
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
            <MailPlus /> Create New User
          </DialogTitle>
          <DialogDescription>
            Create a new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
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
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <CpfInput placeholder="xxx.xxx.xxx-xx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fullName" render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="eg: john.doe@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profiles</FormLabel>

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
                              if (!selected.length) return 'Select profiles'
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
                        <CommandInput placeholder="Search profiles..." />
                        <CommandEmpty>No profile found</CommandEmpty>
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Add a personal note to send for this user in your invitation (optional)"
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
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="user-invite-form">
            Create <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
