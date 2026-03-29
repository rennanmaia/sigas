import { ScrollArea } from "@/components/ui/scroll-area";
import type { Question } from "./form-builder/types/question";
import type { FormResponse } from "../data/responses-mock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnswerEditor } from "./answer-editor";
interface IndividualResponsesProps {
  questions: Question[];
  responses: FormResponse[];
  onDeleteResponse?: (responseId: string) => void;
  handleDeleteClick: (reponseId: string) => void;
  handleAnswerSave: (
    responseId: string,
    questionId: string,
    newValue: any,
  ) => void;
}
export function IndividualResponses({
  questions,
  responses,
  onDeleteResponse,
  handleDeleteClick,
  handleAnswerSave,
}: IndividualResponsesProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pt-4 space-y-6">
        {responses.map((response) => {
          return (
            <Card key={response.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {response.submittedBy}
                    </CardTitle>
                    <CardDescription>
                      {new Date(response.submittedAt).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </CardDescription>
                  </div>
                  {onDeleteResponse && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(response.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((question) => {
                  const answer = response.answers[question.id];
                  const isEdited =
                    response.editedAnswers?.[question.id] ?? false;

                  return (
                    <AnswerEditor
                      key={question.id}
                      question={question}
                      answer={answer}
                      isEdited={isEdited}
                      onSave={(questionId, newValue) =>
                        handleAnswerSave(response.id, questionId, newValue)
                      }
                    />
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
        {responses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Nenhuma resposta ainda</p>
            <p className="text-sm text-muted-foreground">
              As respostas coletadas aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
