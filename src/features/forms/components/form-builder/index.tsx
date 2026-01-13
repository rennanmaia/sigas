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
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createFormSchema } from "../../data/schema";
export function FormBuilder({ onSave }: { onSave: (data: any) => void }) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    setQuestions,
    ...methods
  } = useFormBuilder();
  const handleInternalSave = () => {
    const formData = {
      title,
      description: "Formulário sem descrição",
      status: "Rascunho",
      owner: "Carlos Silva",
      questions,
    };

    const validation = createFormSchema.safeParse(formData);
    // itll enhance validation errors on inputs, for now displaying with alerts to view error logs
    if (!validation.success) {
      const errorMsg = validation.error.message;
      alert(`Erro: ${errorMsg}`);
      return;
    }

    onSave(validation.data);
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
        })
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-background">
        <Sidebar onAdd={methods.addQuestion} />

        <main className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50/50">
          <ScrollArea className="flex-1 w-full h-full">
            <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-40">
              <Card className="p-4 md:p-6 shadow-sm rounded-lg border-t-4 border-t-primary bg-card">
                <Input
                  className="text-xl md:text-3xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent mb-2"
                  placeholder="Título do Formulário"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  className="..."
                  placeholder="Descrição ou instruções..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
                        <Draggable key={q.id} draggableId={q.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              initial={{ opacity: 0, y: -20, scale: 0.95 }}
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
                                  ? provided.draggableProps.style?.transform
                                  : provided.draggableProps.style?.transform,
                              }}
                            >
                              <QuestionCard
                                key={q.id}
                                question={q}
                                index={index}
                                allQuestions={questions}
                                onUpdateQuestion={methods.updateQuestion}
                                onUpdateLabel={methods.updateQuestionLabel}
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
        </main>
      </div>

      <button
        id="submit-builder"
        className="hidden"
        onClick={handleInternalSave}
      />
    </DragDropContext>
  );
}
