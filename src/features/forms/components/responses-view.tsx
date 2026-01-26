import { useState } from "react";
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
import type { Option, Question } from "./form-builder/types/question";
import type { FormResponse } from "../data/responses-mock";

interface ResponsesViewProps {
  formTitle: string;
  questions: Question[];
  responses: FormResponse[];
}

export function ResponsesView({
  formTitle,
  questions,
  responses,
}: ResponsesViewProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const getQuestionStats = (questionId: string, question: Question) => {
    const answers = responses
      .map((r) => r.answers[questionId])
      .filter((answer) => answer !== null && answer !== undefined);

    if (question.type === "select" || question.type === "checkbox") {
      const stats: Record<string, number> = {};
      let totalAnswered = 0;
      answers.forEach((answer) => {
        if (Array.isArray(answer)) {
          totalAnswered++;
          answer.forEach((a) => {
            stats[a] = (stats[a] || 0) + 1;
          });
        } else {
          totalAnswered++;
          stats[answer] = (stats[answer] || 0) + 1;
        }
      });
      return { ...stats, _totalAnswered: totalAnswered };
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

    if (question.type === "date") {
      const dates = answers
        .map((d) => new Date(d))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());
      if (dates.length === 0) return null;
      const earliest = dates[0];
      const latest = dates[dates.length - 1];
      return { earliest, latest, count: dates.length };
    }

    return { count: answers.length, answers };
  };
  const exportToCSV = () => {
    const escapeCSV = (value: any): string => {
      if (value == null) return '""';
      const str = String(value);
      if (
        str.includes(",") ||
        str.includes('"') ||
        str.includes("\n") ||
        str.includes("\r")
      ) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const headers = [
      "Data",
      "Hora",
      "Enviado por",
      ...questions.map((q) => q.label),
    ];

    const rows = responses.map((r) => {
      const date = new Date(r.submittedAt);
      return [
        date.toLocaleDateString("pt-BR"),
        date.toLocaleTimeString("pt-BR"),
        r.submittedBy,
        ...questions.map((q) => {
          const answer = r.answers[q.id];

          if (q.type === "select" && q.options) {
            const option = q.options.find((o) => o.id === answer);
            return option?.label || answer || "";
          }

          if (q.type === "checkbox" && q.options && Array.isArray(answer)) {
            const labels = answer
              .map((optionId) => {
                const option = q.options?.find((o: any) => o.id === optionId);
                return option?.label || optionId;
              })
              .filter(Boolean);
            return labels.join("; ");
          }

          if (Array.isArray(answer)) {
            return answer.join("; ");
          }

          return answer || "";
        }),
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `respostas_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
                {responses.length} respostas
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {questions.length} questões
              </span>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
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
                        {(question.type === "select" ||
                          question.type === "checkbox") &&
                        stats &&
                        typeof stats === "object" &&
                        "_totalAnswered" in stats
                          ? `${stats._totalAnswered} de ${responses.length} responderam`
                          : `${responses.length} respostas`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(question.type === "select" ||
                        question.type === "checkbox") && (
                        <div className="space-y-3">
                          {question.options?.map((option: Option) => {
                            const count = (stats as any)[option.id] || 0;
                            const totalAnswered =
                              (stats as any)._totalAnswered || responses.length;
                            const percentage =
                              totalAnswered > 0
                                ? (count / totalAnswered) * 100
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
                        "avg" in stats &&
                        typeof stats.avg === "number" && (
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

                      {question.type === "date" &&
                        stats &&
                        typeof stats === "object" &&
                        "earliest" in stats &&
                        "latest" in stats &&
                        stats.earliest instanceof Date &&
                        stats.latest instanceof Date && (
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-muted/50">
                              <CardHeader className="pb-2">
                                <CardDescription className="text-xs">
                                  Primeira data
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-xl font-bold">
                                  {stats.earliest.toLocaleDateString("pt-BR")}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-muted/50">
                              <CardHeader className="pb-2">
                                <CardDescription className="text-xs">
                                  Última data
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-xl font-bold">
                                  {stats.latest.toLocaleDateString("pt-BR")}
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
              {responses.map((response) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
