import { CommandInput } from "@/components/ui/command";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type ChatUser } from "../data/chat-types";

type User = Omit<ChatUser, "messages">;

type NewChatProps = {
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: User) => void;
};
export function NewChat({
  users,
  onOpenChange,
  open,
  onSelectUser,
}: NewChatProps) {
  const handleSelect = (user: User) => {
    onSelectUser(user);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border">
          <CommandInput
            placeholder="Buscar pessoas..."
            className="text-foreground"
          />
          <CommandList>
            <CommandEmpty>Pessoas não encontradas.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.fullName}
                  onSelect={() => handleSelect(user)}
                  className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={user.profile || "/placeholder.svg"}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.fullName}</span>
                    <span className="text-accent-foreground/70 text-xs">
                      {user.username}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
