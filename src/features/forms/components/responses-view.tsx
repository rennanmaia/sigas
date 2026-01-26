import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  User,
} from "lucide-react";
import type { Question } from "./form-builder/types/question";
import type { FormResponse } from "../data/responses-mock";

interface ResponsesViewProps {
  formId: string;
  formTitle: string;
  questions: Question[];
  responses: FormResponse[];
}

export function ResponsesView({
  formId,
  formTitle,
  questions,
  responses,
}: ResponsesViewProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const formResponses = useMemo(() => {
    return responses.filter((r) => r.formId === formId);
  }, [responses, formId]);

  const getQuestionStats = (questionId: string, question: Question) => {
    const answers = formResponses
      .map((r) => r.answers[questionId])
      .filter(Boolean);

    if (question.type === "select" || question.type === "checkbox") {
      const stats: Record<string, number> = {};
      answers.forEach((answer) => {
        if (Array.isArray(answer)) {
          answer.forEach((a) => {
            stats[a] = (stats[a] || 0) + 1;
          });
        } else {
          stats[answer] = (stats[answer] || 0) + 1;
        }
      });
      return stats;
    }

    if (question.type === "number") {
      const numbers = answers.map(Number).filter((n) => !isNaN(n));
      if (numbers.length === 0) return null;
      const sum = numbers.reduce((a, b) => a + b, 0);
      const avg = sum / numbers.length;
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      return { avg, min, max, count: numbers.length };
    }

    return { count: answers.length, answers };
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50/50">
      <div className="px-6 pt-6 pb-4 border-b bg-background">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{formTitle}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {formResponses.length} respostas
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {questions.length} questões
              </span>
            </div>
          </div>
          <Button onClick={() => {}} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-6 pt-4 bg-background">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumo
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Individual
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-6 pt-4 space-y-6">
              {questions.map((question) => {
                const stats = getQuestionStats(question.id, question);

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {question.label}
                      </CardTitle>
                      <CardDescription>
                        {formResponses.length} respostas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(question.type === "select" ||
                        question.type === "checkbox") && (
                        <div className="space-y-3">
                          {question.options?.map((option: any) => {
                            const count =
                              (stats as Record<string, number>)[option.id] || 0;
                            const percentage =
                              formResponses.length > 0
                                ? (count / formResponses.length) * 100
                                : 0;

                            return (
                              <div key={option.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">
                                    {option.label}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "number" &&
                        stats &&
                        typeof stats === "object" &&
                        "avg" in stats && (
                          <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-muted/50">
                              <CardHeader className="pb-2">
                                <CardDescription className="text-xs">
                                  Média
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {stats.avg.toFixed(2)}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-muted/50">
                              <CardHeader className="pb-2">
                                <CardDescription className="text-xs">
                                  Mínimo
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {stats.min}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-muted/50">
                              <CardHeader className="pb-2">
                                <CardDescription className="text-xs">
                                  Máximo
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {stats.max}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                      {question.type === "text" &&
                        stats &&
                        typeof stats === "object" &&
                        "answers" in stats && (
                          <div className="space-y-2">
                            {(stats.answers as string[])
                              .slice(0, 5)
                              .map((answer, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-muted/50 rounded-lg text-sm"
                                >
                                  {answer}
                                </div>
                              ))}
                            {(stats.answers as string[]).length > 5 && (
                              <p className="text-sm text-muted-foreground">
                                + {(stats.answers as string[]).length - 5}{" "}
                                respostas
                              </p>
                            )}
                          </div>
                        )}

                      {(question.type === "photo" ||
                        question.type === "file" ||
                        question.type === "audio" ||
                        question.type === "map") &&
                        stats &&
                        typeof stats === "object" &&
                        "count" in stats && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            {stats.count} arquivos enviados
                          </div>
                        )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="individual" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-6 pt-4 space-y-4">
              {formResponses.map((response) => (
                <Card key={response.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {response.submittedBy}
                        </CardTitle>
                        <CardDescription>
                          {new Date(response.submittedAt).toLocaleString(
                            "pt-BR",
                            {
                              dateStyle: "short",
                              timeStyle: "short",
                            },
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {questions.map((question) => {
                      const answer = response.answers[question.id];
                      let displayAnswer = answer;

                      if (question.type === "select" && question.options) {
                        const option = question.options.find(
                          (o: any) => o.id === answer,
                        );
                        displayAnswer = option?.label || answer;
                      }

                      return (
                        <div key={question.id} className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {question.label}
                          </p>
                          <p className="text-sm">
                            {displayAnswer || (
                              <span className="text-muted-foreground italic">
                                Sem resposta
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}

              {formResponses.length === 0 && (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
