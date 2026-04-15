import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Sidebar } from "./components/sidebar";
import { SectionCard } from "./components/section-card";
import { useFormBuilder } from "./hooks/use-form-builder";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createFormSchema } from "../../data/schema";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useForms } from "../forms-provider";
import { ResponsesView } from "../responses-view";
import { formResponses } from "../../data/responses-mock";
import { projects } from "@/features/projects/data/projects-mock";
import { collectionRoutes } from "@/features/projects/data/routes-mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Section } from "./types/question";
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
import { Trans, useTranslation } from "react-i18next";
import { users } from "@/features/users/data/users";

export interface FormBuilderRef {
  getFormData: () => {
    title: string;
    description: string;
    sections: Section[];
    collectors?: string[];
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
    sections,
    setSections,
    loadForm,
    ...methods
  } = useFormBuilder();
  const { forms } = useForms();
  const { t } = useTranslation("forms");
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
      title: t("create.form_builder.form.defaultValues.title"),
      description: t("create.form_builder.form.defaultValues.description"),
      status: "Rascunho" as const,
      owner: "Carlos Silva",
      projectId: "",
      sections: [],
      collectors: [],
    },
  });

  const availableCollectors = useMemo(() => {
    if (!projectId || projectId === "__empty__") return [];
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.members) return [];
    return users
      .filter((u) => {
        const projectSpecificRole = project.memberRoles?.[u.id];
        const displayRole = projectSpecificRole
          ? projectSpecificRole
          : u.roles[0];
        return project.members?.includes(u.id) && displayRole === "collector";
      })
      .map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
      }));
  }, [projectId]);

  const availableRoutes = useMemo(() => {
    if (!initialId) return [];
    return collectionRoutes
      .filter((r) => r.formIds.includes(initialId))
      .map((r) => ({ id: r.id, name: r.name }));
  }, [initialId]);

  const formCollectors = useMemo(() => {
    if (!initialId) return [];
    const collectorIds = [
      ...new Set(
        collectionRoutes
          .filter((r) => r.formIds.includes(initialId))
          .flatMap((r) => r.collectorIds),
      ),
    ];
    return collectorIds
      .map((id) => {
        const user = users.find((u) => u.id === id);
        return user
          ? { id: user.id, name: `${user.firstName} ${user.lastName}` }
          : null;
      })
      .filter((c): c is { id: string; name: string } => c !== null);
  }, [initialId]);

  useImperativeHandle(
    ref,
    () => ({
      getFormData: () => ({
        title,
        description,
        sections,
        collectors: form.getValues("collectors"),
      }),
    }),
    [title, description, sections, form],
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
          description:
            existingForm.description ||
            t("create.form_builder.form.defaultValues.description"),
          status: (existingForm.status as any) || "Rascunho",
          owner: existingForm.owner,
          projectId: existingForm.projectId || "",
          sections: existingForm.sections,
          collectors: existingForm.collectors || [],
        });
        setIsLoaded(true);
      }
    }
  }, [initialId, forms, loadForm]);

  useEffect(() => {
    form.setValue("title", title, { shouldValidate: true });
  }, [title, form]);

  useEffect(() => {
    form.setValue(
      "description",
      description || t("create.form_builder.form.defaultValues.description"),
      { shouldValidate: true },
    );
  }, [description, form]);

  useEffect(() => {
    form.setValue(
      "projectId",
      projectId && projectId !== "__empty__" ? projectId : "",
      { shouldValidate: true },
    );
  }, [projectId, form]);

  useEffect(() => {
    form.setValue("sections", sections, { shouldValidate: true });
  }, [sections, form]);

  const handleDeleteResponse = (responseId: string) => {
    setFilteredResponses((prev) => prev.filter((r) => r.id !== responseId));
  };

  const handleUpdateResponse = (
    responseId: string,
    questionId: string,
    newValue: any,
  ) => {
    setFilteredResponses((prev) =>
      prev.map((r) => {
        if (r.id === responseId) {
          return {
            ...r,
            answers: { ...r.answers, [questionId]: newValue },
            editedAnswers: { ...r.editedAnswers, [questionId]: true },
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      }),
    );
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
      if (rafId) cancelAnimationFrame(rafId);
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
      if (rafId) cancelAnimationFrame(rafId);
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [isLoaded, showingResponses]);

  if (!isLoaded) return null;

  const allQuestions = sections.flatMap((s) => s.questions);

  const handleInternalSave = async () => {
    const status =
      projectId && projectId !== "__empty__" ? "Ativo" : "Rascunho";
    form.setValue("status", status as any);
    form.setValue("owner", "Carlos Silva");
    const isValid = await form.trigger();
    if (!isValid) return;
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
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "QUESTION") {
      const fromSectionId = source.droppableId.replace("questions-", "");
      const toSectionId = destination.droppableId.replace("questions-", "");
      if (fromSectionId === toSectionId) {
        methods.reorderQuestionsInSection(
          fromSectionId,
          source.index,
          destination.index,
        );
      } else {
        methods.moveQuestionBetweenSections(
          fromSectionId,
          source.index,
          toSectionId,
          destination.index,
        );
      }
    } else if (type === "OPTION") {
      const qId = source.droppableId.replace("options-", "");
      methods.reorderOptions(qId, source.index, destination.index);
    }
  };

  return (
    <>
      <Form {...form}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-background">
            <Sidebar
              onAdd={(type) =>
                methods.addQuestion(type, sections[sections.length - 1].id)
              }
              onAddSection={methods.addSection}
              onViewResponses={
                initialId
                  ? () => setShowingResponses(!showingResponses)
                  : undefined
              }
              responsesCount={responsesCount}
              formId={initialId}
              showingResponses={showingResponses}
              availableCollectors={availableCollectors}
              selectedCollectors={form.watch("collectors") || []}
              onCollectorsChange={(newCollectors: string[]) => {
                form.setValue("collectors", newCollectors, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              projectId={projectId}
            />

            {showingResponses && initialId ? (
              <ResponsesView
                formTitle={title}
                questions={allQuestions}
                responses={filteredResponses}
                availableRoutes={availableRoutes}
                availableCollectors={formCollectors}
                onDeleteResponse={handleDeleteResponse}
                onUpdateResponse={handleUpdateResponse}
              />
            ) : (
              <main className="flex-1 h-full overflow-hidden flex flex-col bg-muted relative">
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
                                placeholder={t(
                                  "create.form_builder.form.title.placeholder",
                                )}
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
                                placeholder={t(
                                  "create.form_builder.form.description.placeholder",
                                )}
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
                              {t("create.form_builder.form.project.title")}
                            </Label>
                            <FormControl>
                              <Select
                                value={projectId || "__empty__"}
                                onValueChange={(value) => {
                                  const newValue =
                                    value === "__empty__" ? "" : value;
                                  setProjectId(newValue);
                                  field.onChange(newValue);
                                  form.setValue("collectors", [], {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                disabled={!!initialProjectId && !initialId}
                              >
                                <SelectTrigger
                                  id="project-select"
                                  className={
                                    fieldState.error ? "border-destructive" : ""
                                  }
                                >
                                  <SelectValue
                                    placeholder={t(
                                      "create.form_builder.form.project.placeholder",
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {!initialId && (
                                    <SelectItem value="__empty__">
                                      {t(
                                        "create.form_builder.form.project.empty",
                                      )}
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
                                  {t(
                                    "create.form_builder.form.project.preselected",
                                  )}
                                </p>
                              )}
                          </FormItem>
                        )}
                      />

                      {allQuestions.length === 0 && (
                        <Alert className="mt-4 border-amber-200 bg-amber-50">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800">
                            {t("create.form_builder.form.questions.alert")}
                          </AlertDescription>
                        </Alert>
                      )}
                    </Card>

                    <div className="space-y-6">
                      {sections.map((section, sectionIndex) => (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        >
                          <SectionCard
                            section={section}
                            sectionIndex={sectionIndex}
                            totalSections={sections.length}
                            allSections={sections}
                            onMoveUp={
                              sectionIndex > 0
                                ? () =>
                                    methods.reorderSections(
                                      sectionIndex,
                                      sectionIndex - 1,
                                    )
                                : undefined
                            }
                            onMoveDown={
                              sectionIndex < sections.length - 1
                                ? () =>
                                    methods.reorderSections(
                                      sectionIndex,
                                      sectionIndex + 1,
                                    )
                                : undefined
                            }
                            sectionErrors={
                              (form.formState.errors.sections as any)?.[
                                sectionIndex
                              ]
                            }
                            onUpdateSection={(updates) =>
                              methods.updateSection(section.id, updates)
                            }
                            onRemoveSection={() =>
                              methods.removeSection(section.id)
                            }
                            onAddQuestion={(type, atIndex) =>
                              methods.addQuestion(type, section.id, atIndex)
                            }
                            onUpdateQuestion={(id, updates) =>
                              methods.updateQuestion(id, section.id, updates)
                            }
                            onUpdateLabel={(id, val) =>
                              methods.updateQuestionLabel(id, section.id, val)
                            }
                            onUpdateType={(id, type) =>
                              methods.updateQuestionType(id, section.id, type)
                            }
                            onRemove={(id) =>
                              methods.removeQuestion(id, section.id)
                            }
                            onToggleRequired={(id) =>
                              methods.toggleRequired(id, section.id)
                            }
                            onDuplicate={(id) =>
                              methods.duplicateQuestion(id, section.id)
                            }
                            onAddOption={(id) =>
                              methods.addOption(id, section.id)
                            }
                            onUpdateOption={(id, idx, val) =>
                              methods.updateOption(id, section.id, idx, val)
                            }
                            onRemoveOption={(id, idx) =>
                              methods.removeOption(id, section.id, idx)
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
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
        title={t("create.form_builder.dialog.confirm.title")}
        desc={
          <Trans
            i18nKey={
              "forms:create.form_builder.dialog.confirm.description" as any
            }
            components={[
              <p />,
              <strong />,
              <p className="text-sm font-medium" />,
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm" />,
              <p className="mt-3" />,
            ]}
          />
        }
        confirmText={t("create.form_builder.dialog.confirm.confirm")}
        cancelBtnText={t("create.form_builder.dialog.confirm.cancel")}
      />
    </>
  );
});
