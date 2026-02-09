import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Sidebar } from "./components/sidebar";
import { QuestionCard } from "./components/question-card";
import { useFormBuilder } from "./hooks/use-form-builder";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, ArrowUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createFormSchema } from "../../data/schema";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useForms } from "../forms-provider";
import { ResponsesView } from "../responses-view";
import { formResponses } from "../../data/responses-mock";
import { projects } from "@/features/projects/data/projects-mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Question } from "./types/question";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface FormBuilderRef {
  getFormData: () => {
    title: string;
    description: string;
    questions: Question[];
  };
}

export const FormBuilder = forwardRef<
  FormBuilderRef,
  {
    onSave: (data: any) => void;
    initialId?: string;
    initialProjectId?: string;
  }
>(function FormBuilder({ onSave, initialId, initialProjectId }, ref) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    setQuestions,
    loadForm,
    ...methods
  } = useFormBuilder();
  const { forms } = useForms();
  const [isLoaded, setIsLoaded] = useState(!initialId);
  const [showingResponses, setShowingResponses] = useState(false);
  const [filteredResponses, setFilteredResponses] = useState<
    typeof formResponses
  >([]);
  const [projectId, setProjectId] = useState<string>(
    initialProjectId || "__empty__",
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<any>({
    resolver: zodResolver(createFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "Formulário sem título",
      description: "Formulário sem descrição",
      status: "Rascunho" as const,
      owner: "Carlos Silva",
      projectId: "",
      questions: [],
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      getFormData: () => ({ title, description, questions }),
    }),
    [title, description, questions],
  );

  const currentForm = forms.find((f) => f.id === initialId);
  const responsesCount = currentForm?.responses || 0;

  useEffect(() => {
    if (initialId) {
      setFilteredResponses(formResponses.filter((r) => r.formId === initialId));
    }
  }, [initialId]);

  useEffect(() => {
    if (initialId && forms.length > 0) {
      const existingForm = forms.find((f) => f.id === initialId);
      if (existingForm) {
        loadForm(existingForm);
        setProjectId(existingForm.projectId || "__empty__");
        form.reset({
          title: existingForm.title,
          description: existingForm.description || "Formulário sem descrição",
          status: (existingForm.status as any) || "Rascunho",
          owner: existingForm.owner,
          projectId: existingForm.projectId || "",
          questions: existingForm.questions,
        });
        setIsLoaded(true);
      }
    }
  }, [initialId, forms, loadForm]);

  useEffect(() => {
    form.setValue("title", title, { shouldValidate: true });
  }, [title, form]);

  useEffect(() => {
    form.setValue("description", description || "Formulário sem descrição", {
      shouldValidate: true,
    });
  }, [description, form]);

  useEffect(() => {
    form.setValue(
      "projectId",
      projectId && projectId !== "__empty__" ? projectId : "",
      { shouldValidate: true },
    );
  }, [projectId, form]);

  useEffect(() => {
    form.setValue("questions", questions, { shouldValidate: true });
  }, [questions, form]);

  const handleDeleteResponse = (responseId: string) => {
    setFilteredResponses((prev) => prev.filter((r) => r.id !== responseId));
    // TODO: make an API call to delete the response and update the forms list to decrement the response count
  };

  const scrollToTop = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    const button = scrollButtonRef.current;

    if (!viewport || !button) return;

    let rafId: number;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollTop = viewport.scrollTop;
        if (scrollTop > 400) {
          button.style.opacity = "1";
          button.style.pointerEvents = "auto";
          button.style.transform = "scale(1)";
        } else {
          button.style.opacity = "0";
          button.style.pointerEvents = "none";
          button.style.transform = "scale(0.8)";
        }
      });
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [isLoaded, showingResponses]);

  if (!isLoaded) return null;

  const handleInternalSave = async () => {
    const status =
      projectId && projectId !== "__empty__" ? "Ativo" : "Rascunho";
    form.setValue("status", status as any);
    form.setValue("owner", "Carlos Silva");

    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    if (!projectId || projectId === "__empty__") {
      setShowConfirmDialog(true);
      return;
    }

    const formData = form.getValues();
    onSave(formData);
  };

  const handleConfirmSaveWithoutProject = () => {
    setShowConfirmDialog(false);
    const formData = form.getValues();
    onSave(formData);
  };
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (type === "QUESTION") {
      const items = Array.from(questions);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setQuestions(items);
    } else if (type === "OPTION") {
      const qId = source.droppableId.replace("options-", "");
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === qId && q.options) {
            const newOpts = Array.from(q.options);
            const [moved] = newOpts.splice(source.index, 1);
            newOpts.splice(destination.index, 0, moved);
            return { ...q, options: newOpts };
          }
          return q;
        }),
      );
    }
  };

  return (
    <>
      <Form {...form}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-background">
            <Sidebar
              onAdd={methods.addQuestion}
              onViewResponses={
                initialId
                  ? () => setShowingResponses(!showingResponses)
                  : undefined
              }
              responsesCount={responsesCount}
              formId={initialId}
              showingResponses={showingResponses}
            />

            {showingResponses && initialId ? (
              <ResponsesView
                formTitle={title}
                questions={questions}
                responses={filteredResponses}
                onDeleteResponse={handleDeleteResponse}
              />
            ) : (
              <main className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50/50 relative">
                <ScrollArea
                  ref={scrollAreaRef}
                  className="flex-1 w-full h-full"
                >
                  <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-40">
                    <Card className="p-4 md:p-6 shadow-sm rounded-lg border-t-4 border-t-primary bg-card">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => (
                          <FormItem className="mb-2">
                            <FormControl>
                              <Input
                                {...field}
                                className="text-xl md:text-3xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent"
                                placeholder="Título do Formulário"
                                value={title}
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            {fieldState.error && (
                              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                                <AlertCircle size={12} />
                                <FormMessage />
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="text-sm border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-muted-foreground"
                                placeholder="Descrição ou instruções..."
                                value={description}
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            {fieldState.error && (
                              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                                <AlertCircle size={12} />
                                <FormMessage />
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field, fieldState }) => (
                          <FormItem className="mt-4 space-y-2">
                            <Label
                              htmlFor="project-select"
                              className="text-sm font-medium"
                            >
                              Projeto vinculado *
                            </Label>
                            <FormControl>
                              <Select
                                value={projectId || "__empty__"}
                                onValueChange={(value) => {
                                  const newValue =
                                    value === "__empty__" ? "" : value;
                                  setProjectId(newValue);
                                  field.onChange(newValue);
                                }}
                                disabled={!!initialProjectId && !initialId}
                              >
                                <SelectTrigger
                                  id="project-select"
                                  className={
                                    fieldState.error ? "border-destructive" : ""
                                  }
                                >
                                  <SelectValue placeholder="Selecione um projeto" />
                                </SelectTrigger>
                                <SelectContent>
                                  {!initialId && (
                                    <SelectItem value="__empty__">
                                      Nenhum (criar como rascunho)
                                    </SelectItem>
                                  )}
                                  {projects.map((project) => (
                                    <SelectItem
                                      key={project.id}
                                      value={project.id}
                                    >
                                      {project.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {fieldState.error && (
                              <div className="flex items-center gap-1 text-xs text-destructive">
                                <AlertCircle size={12} />
                                <FormMessage />
                              </div>
                            )}
                            {!fieldState.error &&
                              initialProjectId &&
                              projectId &&
                              !initialId && (
                                <p className="text-xs text-muted-foreground">
                                  Projeto pré-selecionado e não pode ser
                                  alterado
                                </p>
                              )}
                          </FormItem>
                        )}
                      />

                      {questions.length === 0 && (
                        <Alert className="mt-4 border-amber-200 bg-amber-50">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800">
                            Adicione pelo menos uma pergunta ao formulário antes
                            de salvá-lo.
                          </AlertDescription>
                        </Alert>
                      )}
                    </Card>

                    <Droppable droppableId="form-questions" type="QUESTION">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          <AnimatePresence initial={false}>
                            {questions.map((q, index) => (
                              <Draggable
                                key={q.id}
                                draggableId={q.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    initial={{
                                      opacity: 0,
                                      y: -20,
                                      scale: 0.95,
                                    }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{
                                      opacity: 0,
                                      scale: 0.95,
                                      transition: { duration: 0.2 },
                                    }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 25,
                                    }}
                                    style={{
                                      ...provided.draggableProps.style,
                                      transform: snapshot.isDragging
                                        ? provided.draggableProps.style
                                            ?.transform
                                        : provided.draggableProps.style
                                            ?.transform,
                                    }}
                                  >
                                    <QuestionCard
                                      key={q.id}
                                      question={q}
                                      index={index}
                                      allQuestions={questions}
                                      onUpdateQuestion={methods.updateQuestion}
                                      onUpdateLabel={
                                        methods.updateQuestionLabel
                                      }
                                      onUpdateType={methods.updateQuestionType}
                                      onRemove={methods.removeQuestion}
                                      onToggleRequired={methods.toggleRequired}
                                      onAddQuestion={(type) =>
                                        methods.addQuestion(type, index)
                                      }
                                      onAddOption={methods.addOption}
                                      onUpdateOption={methods.updateOption}
                                      onRemoveOption={methods.removeOption}
                                      onDuplicate={methods.duplicateQuestion}
                                      labelError={
                                        (
                                          form.formState.errors.questions as any
                                        )?.[index]?.label?.message
                                      }
                                      optionsError={
                                        (
                                          form.formState.errors.questions as any
                                        )?.[index]?.options?.message
                                      }
                                      optionsErrors={
                                        Array.isArray(
                                          (
                                            form.formState.errors
                                              .questions as any
                                          )?.[index]?.options,
                                        )
                                          ? (
                                              form.formState.errors
                                                .questions as any
                                            )?.[index]?.options
                                          : undefined
                                      }
                                    />
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {questions.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/5 px-6 text-center">
                        <Plus className="mb-4 opacity-20" size={48} />
                        <p className="text-base font-medium">
                          Seu formulário está vazio.
                        </p>
                        <p className="text-sm">
                          Selecione um tipo de questão para começar.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {!showingResponses && (
                  <button
                    ref={scrollButtonRef}
                    onClick={scrollToTop}
                    className="absolute bottom-6 right-6 z-50 size-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-[background-color] flex items-center justify-center group"
                    style={{
                      opacity: 0,
                      pointerEvents: "none",
                      transform: "scale(0.8)",
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                    }}
                    aria-label="Voltar ao topo"
                  >
                    <ArrowUp
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>
                )}
              </main>
            )}
          </div>

          <button
            id="submit-builder"
            className="hidden"
            onClick={handleInternalSave}
          />
        </DragDropContext>
      </Form>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        handleConfirm={handleConfirmSaveWithoutProject}
        title="Salvar sem projeto vinculado?"
        desc={
          <div className="space-y-2">
            <p>
              Este formulário será criado <strong>SEM projeto vinculado</strong>
              .
            </p>
            <div className="space-y-1 text-sm">
              <p>Isso significa que:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Ele será salvo como <strong>RASCUNHO</strong>
                </li>
                <li>
                  <strong>NÃO</strong> poderá ser respondido
                </li>
                <li>Para ativá-lo, você precisará vinculá-lo a um projeto</li>
              </ul>
            </div>
            <p className="mt-3">Deseja continuar mesmo assim?</p>
          </div>
        }
        confirmText="Sim, salvar como rascunho"
        cancelBtnText="Cancelar"
      />
    </>
  );
});
