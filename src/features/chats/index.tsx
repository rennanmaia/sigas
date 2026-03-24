import { useState, useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Paperclip,
  ImagePlus,
  FileAudio,
  FileText,
  Search as SearchIcon,
  Send,
  MessagesSquare,
  Mic,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitch } from "@/components/language-switch";
import { NewChat } from "./components/new-chat";
import { type ChatUser, type Convo } from "./data/chat-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Fake Data
import { conversations } from "./data/convo.json";

export function Chats() {
  const { t } = useTranslation("chats");
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);
  const [convos, setConvos] = useState<ChatUser[]>(() =>
    conversations.map((c) => ({ ...c, messages: [...c.messages] })),
  );
  const [messageText, setMessageText] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const selectedUser = selectedUserId
    ? (convos.find((c) => c.id === selectedUserId) ?? null)
    : null;

  // Filtered data based on the search query
  const filteredChatList = convos.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const currentMessage = selectedUser?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, "dd/MM/yyyy");

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current object to the array
      acc[key].push(obj);

      return acc;
    },
    {},
  );

  const users = convos.map(({ messages, ...user }) => user);

  const handleOpenConversation = (user: Omit<ChatUser, "messages">) => {
    const existing = convos.find((c) => c.id === user.id);
    if (!existing) {
      setConvos((prev) => [{ ...user, messages: [] }, ...prev]);
    }
    setSelectedUserId(user.id);
    setIsMobileOpen(true);
    setCreateConversationDialog(false);
  };

  const handleSendMessage = () => {
    if (!selectedUser || !messageText.trim()) return;
    const newMsg: Convo = {
      sender: "You",
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
    };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === selectedUser.id
          ? { ...c, messages: [newMsg, ...c.messages] }
          : c,
      ),
    );
    setMessageText("");
  };

  const handleFileAttach = (file: File) => {
    if (!selectedUser) return;
    const isImage = file.type.startsWith("image/");
    const fileUrl = isImage ? URL.createObjectURL(file) : undefined;
    const newMsg: Convo = {
      sender: "You",
      message: "",
      timestamp: new Date().toISOString(),
      fileName: file.name,
      fileType: file.type,
      fileUrl,
    };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === selectedUser.id
          ? { ...c, messages: [newMsg, ...c.messages] }
          : c,
      ),
    );
  };

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </Header>

      <Main fixed>
        <section className="flex h-full gap-6">
          {/* Left Side */}
          <div className="flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80">
            <div className="bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none">
              <div className="flex items-center justify-between py-2">
                <div className="flex gap-2">
                  <h1 className="text-2xl font-bold">{t("title")}</h1>
                  <MessagesSquare size={20} />
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setCreateConversationDialog(true)}
                  className="rounded-lg"
                >
                  <Edit size={24} className="stroke-muted-foreground" />
                </Button>
              </div>

              <label
                className={cn(
                  "focus-within:ring-ring focus-within:ring-1 focus-within:outline-hidden",
                  "border-border flex h-10 w-full items-center space-x-0 rounded-md border ps-2",
                )}
              >
                <SearchIcon size={15} className="me-2 stroke-slate-500" />
                <span className="sr-only">Search</span>
                <input
                  type="text"
                  className="w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden"
                  placeholder={t("search.placeholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className="-mx-3 h-full overflow-scroll p-3">
              {filteredChatList.map((chatUsr) => {
                const { id, profile, username, messages, fullName } = chatUsr;
                const lastConvo = messages[0];
                const lastPreview =
                  lastConvo.fileName && !lastConvo.message
                    ? lastConvo.fileName
                    : lastConvo.message;
                const lastMsg =
                  lastConvo.sender === "You"
                    ? `Você: ${lastPreview}`
                    : lastPreview;
                return (
                  <Fragment key={id}>
                    <button
                      type="button"
                      className={cn(
                        "group hover:bg-accent hover:text-accent-foreground",
                        `flex w-full rounded-md px-2 py-2 text-start text-sm`,
                        selectedUser?.id === id && "sm:bg-muted",
                      )}
                      onClick={() => {
                        setSelectedUserId(chatUsr.id);
                        setIsMobileOpen(true);
                      }}
                    >
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarImage src={profile} alt={username} />
                          <AvatarFallback>{username}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="col-start-2 row-span-2 font-medium">
                            {fullName}
                          </span>
                          <span className="text-muted-foreground group-hover:text-accent-foreground/90 col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis">
                            {lastMsg}
                          </span>
                        </div>
                      </div>
                    </button>
                    <Separator className="my-1" />
                  </Fragment>
                );
              })}
            </ScrollArea>
          </div>

          {/* Right Side */}
          {selectedUser ? (
            <div
              className={cn(
                "bg-background absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col border shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md",
                isMobileOpen && "start-0 flex",
              )}
            >
              {/* Top Part */}
              <div className="bg-card mb-1 flex flex-none justify-between p-4 shadow-lg sm:rounded-t-md">
                {/* Left */}
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="-ms-2 h-full sm:hidden"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <ArrowLeft className="rtl:rotate-180" />
                  </Button>
                  <div className="flex items-center gap-2 lg:gap-4">
                    <Avatar className="size-9 lg:size-11">
                      <AvatarImage
                        src={selectedUser.profile}
                        alt={selectedUser.username}
                      />
                      <AvatarFallback>{selectedUser.username}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
                        {selectedUser.fullName}
                      </span>
                      <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm">
                        {selectedUser.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="-me-1 flex items-center gap-1 lg:gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
                  >
                    <MoreVertical className="stroke-muted-foreground sm:size-5" />
                  </Button>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4">
                <div className="flex size-full flex-1">
                  <div className="chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden">
                    <div className="chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4">
                      {currentMessage &&
                        Object.keys(currentMessage).map((key) => (
                          <Fragment key={key}>
                            {currentMessage[key].map((msg, index) => (
                              <div
                                key={`${msg.sender}-${msg.timestamp}-${index}`}
                                className={cn(
                                  "chat-box max-w-72 px-3 py-2 wrap-break-word shadow-lg",
                                  msg.sender === "You"
                                    ? "bg-primary/90 text-primary-foreground/75 self-end rounded-[16px_16px_0_16px]"
                                    : "bg-muted self-start rounded-[16px_16px_16px_0]",
                                )}
                              >
                                {msg.fileUrl &&
                                  msg.fileType?.startsWith("image/") && (
                                    <img
                                      src={msg.fileUrl}
                                      alt={msg.fileName}
                                      className="mb-1 max-w-full rounded-md"
                                    />
                                  )}
                                {msg.fileName &&
                                  !msg.fileType?.startsWith("image/") && (
                                    <div className="mb-1 flex items-center gap-1.5 rounded-md bg-black/10 px-2 py-1 text-xs">
                                      {msg.fileType?.startsWith("audio/") ? (
                                        <Mic className="h-3 w-3 shrink-0" />
                                      ) : (
                                        <File className="h-3 w-3 shrink-0" />
                                      )}
                                      <span className="max-w-[180px] truncate">
                                        {msg.fileName}
                                      </span>
                                    </div>
                                  )}
                                {msg.message && <>{msg.message} </>}
                                <span
                                  className={cn(
                                    "text-foreground/75 mt-1 block text-xs font-light italic",
                                    msg.sender === "You" &&
                                      "text-primary-foreground/85 text-end",
                                  )}
                                >
                                  {format(msg.timestamp, "h:mm a")}
                                </span>
                              </div>
                            ))}
                            <div className="text-center text-xs">{key}</div>
                          </Fragment>
                        ))}
                    </div>
                  </div>
                </div>
                <form
                  className="flex w-full flex-none gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <div className="border-input bg-card focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4">
                    <div className="space-x-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            className="hidden h-8 rounded-md lg:inline-flex"
                          >
                            <Paperclip
                              size={20}
                              className="stroke-muted-foreground"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          align="start"
                          className="w-44 p-1"
                        >
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <ImagePlus className="h-4 w-4 text-muted-foreground" />
                            Imagem
                          </button>
                          <button
                            type="button"
                            onClick={() => audioInputRef.current?.click()}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <FileAudio className="h-4 w-4 text-muted-foreground" />
                            Áudio
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Documento
                          </button>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <label className="flex-1">
                      <span className="sr-only">Chat Text Box</span>
                      <input
                        type="text"
                        placeholder={t("messages.typePlaceholder")}
                        className="h-8 w-full bg-inherit focus-visible:outline-hidden"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                    </label>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="hidden sm:inline-flex"
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                  <Button type="submit" className="h-full sm:hidden">
                    <Send size={18} /> {t("buttons.send")}
                  </Button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileAttach(file);
                      e.target.value = "";
                    }}
                  />
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileAttach(file);
                      e.target.value = "";
                    }}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileAttach(file);
                      e.target.value = "";
                    }}
                  />
                </form>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "bg-card absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs sm:static sm:z-auto sm:flex",
              )}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="border-border flex size-16 items-center justify-center rounded-full border-2">
                  <MessagesSquare className="size-8" />
                </div>
                <div className="space-y-2 text-center">
                  <h1 className="text-xl font-semibold">
                    {t("messages.noChat")}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {t("messages.noChat")}
                  </p>
                </div>
                <Button onClick={() => setCreateConversationDialog(true)}>
                  {t("buttons.new")}
                </Button>
              </div>
            </div>
          )}
        </section>
        <NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
          onSelectUser={handleOpenConversation}
        />
      </Main>
    </>
  );
}
