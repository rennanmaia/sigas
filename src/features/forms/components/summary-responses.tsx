import { lazy, Suspense, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FormResponse } from "../data/responses-mock";
import type { Question } from "./form-builder/types/question";
import type { MapViewMode } from "./form-builder/heatmap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bookmark,
  BookmarkCheck,
  ChartColumnBig,
  ChartLine,
  ChartPie,
  Download,
  Flame,
  MapPin,
  MapPinned,
  Radar,
  ScanSearch,
} from "lucide-react";
import { ChartBarDefault } from "./charts/chart-bar";
import { ChartPieLabel } from "./charts/chart-pie";
import { ChartLineInteractive } from "./charts/chart-line";
import { ChartRadar } from "./charts/chart-radar";
import { useResponsePreferences } from "@/context/response-provider";

const HeatMap = lazy(() => import("./form-builder/heatmap"));

interface SummaryResponsesProps {
  questions: Question[];
  responses: FormResponse[];
}
export function SummaryResponses({
  questions,
  responses,
}: SummaryResponsesProps) {
  const chartSupportedTypes: Question["type"][] = [
    "select",
    "checkbox",
    "number",
    "date",
  ];

  const {
    chartTabs: savedChartTabs,
    mapModes: savedMapModes,
    saveChartTab,
    saveMapMode,
  } = useResponsePreferences();

  const [questionViewTabs, setQuestionViewTabs] =
    useState<Record<string, string>>(savedChartTabs);

  const [mapViewModes, setMapViewModes] =
    useState<Record<string, MapViewMode>>(savedMapModes);

  const [selectedMapPoints, setSelectedMapPoints] = useState<
    Record<string, number | undefined>
  >({});

  const [savedQuestions, setSavedQuestions] = useState<Record<string, boolean>>(
    {},
  );

  const handleSaveChartTab = (questionId: string) => {
    saveChartTab(questionId, getQuestionViewTab(questionId));
    setSavedQuestions((prev) => ({ ...prev, [questionId]: true }));
    setTimeout(() => {
      setSavedQuestions((prev) => ({ ...prev, [questionId]: false }));
    }, 1800);
  };

  const getQuestionViewTab = (questionId: string) =>
    questionViewTabs[questionId] ?? "bar-view";

  const setQuestionViewTab = (questionId: string, value: string) =>
    setQuestionViewTabs((prev) => ({ ...prev, [questionId]: value }));

  const getMapViewMode = (questionId: string): MapViewMode =>
    mapViewModes[questionId] ?? "heatmap";

  const setMapViewMode = (questionId: string, value: MapViewMode) => {
    setMapViewModes((prev) => ({ ...prev, [questionId]: value }));
    if (value !== "highlight") {
      setSelectedMapPoints((prev) => ({ ...prev, [questionId]: undefined }));
    }
    saveMapMode(questionId, value);
  };

  const getSelectedMapPoint = (questionId: string) =>
    selectedMapPoints[questionId];

  const setSelectedMapPoint = (questionId: string, index: number) => {
    setSelectedMapPoints((prev) => ({ ...prev, [questionId]: index }));
    setMapViewModes((prev) => ({ ...prev, [questionId]: "highlight" }));
  };

  const parseMapCoords = (
    answer: string,
    label?: string,
  ): { lat: number; lng: number; label?: string } | null => {
    const match = answer.match(/lat:([-\d.]+),lng:([-\d.]+)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]), label };
  };

  const getMapPoints = (questionId: string) => {
    return responses.flatMap((r) => {
      const answer = r.answers[questionId];
      if (!answer || typeof answer !== "string") return [];
      const point = parseMapCoords(answer, r.submittedBy);
      return point ? [point] : [];
    });
  };

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

  const getChartData = (question: Question) => {
    if (question.type === "select" || question.type === "checkbox") {
      const counts: Record<string, number> = {};
      responses.forEach((r) => {
        const answer = r.answers[question.id];
        if (Array.isArray(answer)) {
          answer.forEach((a) => {
            counts[a] = (counts[a] || 0) + 1;
          });
        } else if (answer != null) {
          counts[answer] = (counts[answer] || 0) + 1;
        }
      });
      return (
        question.options?.map((opt) => ({
          label: opt.label,
          value: counts[opt.id] || 0,
        })) ?? []
      );
    }

    if (question.type === "number") {
      const numbers = responses
        .map((r) => Number(r.answers[question.id]))
        .filter((n) => !isNaN(n));
      if (!numbers.length) return [];
      const sum = numbers.reduce((a, b) => a + b, 0);
      return [
        { label: "Mínimo", value: Math.min(...numbers) },
        {
          label: "Média",
          value: Math.round((sum / numbers.length) * 100) / 100,
        },
        { label: "Máximo", value: Math.max(...numbers) },
      ];
    }

    if (question.type === "date") {
      const counts: Record<string, number> = {};
      responses.forEach((r) => {
        const raw = r.answers[question.id];
        if (!raw) return;
        const d = new Date(raw);
        if (isNaN(d.getTime())) return;
        const label = d.toLocaleDateString("pt-BR");
        counts[label] = (counts[label] || 0) + 1;
      });
      return Object.entries(counts)
        .sort(([a], [b]) => {
          const parse = (s: string) => {
            const [day, month, year] = s.split("/").map(Number);
            return new Date(year, month - 1, day).getTime();
          };
          return parse(a) - parse(b);
        })
        .map(([label, value]) => ({ label, value }));
    }

    return [];
  };

  const getTextAnswers = (question: Question): string[] => {
    const textTypes = ["text", "textarea", "photo", "map", "file", "audio"];
    if (!textTypes.includes(question.type)) return [];
    return responses
      .flatMap((r) => {
        const answer = r.answers[question.id];
        if (answer == null || answer === "") return [];

        if (Array.isArray(answer)) {
          return answer
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);
        }

        const value = String(answer).trim();
        return value ? [value] : [];
      })
      .filter((a): a is string => a.length > 0);
  };

  const getGroupedNonChartAnswers = (question: Question): string[][] => {
    const textTypes = ["text", "textarea", "photo", "map", "file", "audio"];
    if (!textTypes.includes(question.type)) return [];

    return responses
      .map((r) => {
        const answer = r.answers[question.id];
        if (answer == null || answer === "") return [];

        if (Array.isArray(answer)) {
          return answer
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);
        }

        const value = String(answer).trim();
        return value ? [value] : [];
      })
      .filter((group) => group.length > 0);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pt-4 space-y-6">
        {questions.map((question) => {
          const shouldShowChartTabs = chartSupportedTypes.includes(
            question.type,
          );
          const stats = getQuestionStats(question.id, question);
          const chartData = getChartData(question);
          const textAnswers = getTextAnswers(question);
          const groupedNonChartAnswers = getGroupedNonChartAnswers(question);

          if (!shouldShowChartTabs) {
            if (question.type === "map") {
              const mapPoints = getMapPoints(question.id);
              const mapMode = getMapViewMode(question.id);
              const selectedIdx = getSelectedMapPoint(question.id);

              const mapResponses = responses.filter((r) => {
                const answer = r.answers[question.id];
                return (
                  answer &&
                  typeof answer === "string" &&
                  answer.includes("lat:")
                );
              });

              return (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-base flex justify-between items-start gap-2">
                      <span>{question.label}</span>
                      <TooltipProvider>
                        <div className="flex shrink-0 rounded-md border overflow-hidden">
                          {(
                            [
                              {
                                value: "heatmap" as MapViewMode,
                                icon: <Flame className="h-4 w-4" />,
                                title: "Mapa de calor",
                              },
                              {
                                value: "pins" as MapViewMode,
                                icon: <MapPinned className="h-4 w-4" />,
                                title: "Todos os pontos",
                              },
                              {
                                value: "highlight" as MapViewMode,
                                icon: <ScanSearch className="h-4 w-4" />,
                                title: "Ponto individual",
                              },
                            ] as const
                          ).map((item) => (
                            <Tooltip key={item.value}>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={
                                    mapMode === item.value ? "default" : "ghost"
                                  }
                                  className="h-8 w-8 p-0 rounded-none border-0"
                                  onClick={() =>
                                    setMapViewMode(question.id, item.value)
                                  }
                                >
                                  {item.icon}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {item.title}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>
                      {mapResponses.length} de {responses.length} responderam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mapPoints.length > 0 ? (
                      <div className="flex gap-4 min-h-[280px]">
                        <ScrollArea className="w-1/2 rounded-md border">
                          <div className="p-2 space-y-1">
                            {mapResponses.map((r, index) => {
                              const answer = r.answers[question.id] as string;
                              const coords = parseMapCoords(answer);
                              const isSelected = selectedIdx === index;
                              return (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedMapPoint(question.id, index)
                                  }
                                  className={`w-full text-left flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted/70 bg-muted/30"
                                  }`}
                                >
                                  <MapPin
                                    className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium truncate">
                                      {r.submittedBy}
                                    </span>
                                    {coords && (
                                      <span
                                        className={`text-xs font-mono truncate ${isSelected ? "text-primary-foreground/75" : "text-muted-foreground"}`}
                                      >
                                        {coords.lat.toFixed(4)},{" "}
                                        {coords.lng.toFixed(4)}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                        <div className="w-1/2 rounded-md overflow-hidden border">
                          <Suspense
                            fallback={
                              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                Carregando mapa...
                              </div>
                            }
                          >
                            <HeatMap
                              points={mapPoints}
                              mode={mapMode}
                              selectedIndex={selectedIdx}
                              className="h-full"
                            />
                          </Suspense>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Sem respostas de localização para exibir.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base">{question.label}</CardTitle>
                  <CardDescription>
                    {stats && typeof stats === "object" && "count" in stats
                      ? `${stats.count} de ${responses.length} responderam`
                      : `${responses.length} respostas`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {groupedNonChartAnswers.length ? (
                    <div className="space-y-2">
                      {groupedNonChartAnswers.map((answersGroup, index) => (
                        <div
                          key={`${question.id}-text-answer-${index}`}
                          className="flex items-start justify-between gap-3 w-full rounded-md bg-muted/50 px-3 py-2"
                        >
                          <div className="flex-1">
                            {answersGroup.length === 1 ? (
                              <p className="text-sm whitespace-pre-wrap wrap-break-word">
                                {answersGroup[0]}
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {answersGroup.map((fileName, fileIndex) => (
                                  <div
                                    key={`${question.id}-text-answer-${index}-${fileIndex}`}
                                    className="max-w-full rounded-md border bg-background px-2 py-1 text-sm wrap-break-word"
                                  >
                                    {fileName}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {(question.type === "photo" ||
                            question.type === "file" ||
                            question.type === "audio") && (
                            <Download className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground cursor-pointer transition-colors hover:text-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Sem respostas para exibir.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={question.id}>
              <Tabs
                value={getQuestionViewTab(question.id)}
                onValueChange={(value) =>
                  setQuestionViewTab(question.id, value)
                }
              >
                <CardHeader>
                  <CardTitle className="text-base flex justify-between items-center">
                    {question.label}
                    <TooltipProvider>
                      <div className="flex items-center gap-2">
                        <TabsList className="grid grid-cols-4">
                          {(
                            [
                              {
                                value: "bar-view",
                                icon: <ChartColumnBig className="h-4 w-4" />,
                                title: "Gráfico de barras",
                              },
                              {
                                value: "pie-view",
                                icon: <ChartPie className="h-4 w-4" />,
                                title: "Gráfico de pizza",
                              },
                              {
                                value: "line-view",
                                icon: <ChartLine className="h-4 w-4" />,
                                title: "Gráfico de linha",
                              },
                              {
                                value: "radar-view",
                                icon: <Radar className="h-4 w-4" />,
                                title: "Gráfico de radar",
                              },
                            ] as const
                          ).map((item) => (
                            <Tooltip key={item.value}>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <TabsTrigger value={item.value}>
                                    {item.icon}
                                  </TabsTrigger>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {item.title}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </TabsList>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                savedQuestions[question.id]
                                  ? "default"
                                  : "outline"
                              }
                              className="gap-1.5 transition-all duration-200"
                              onClick={() => handleSaveChartTab(question.id)}
                            >
                              {savedQuestions[question.id] ? (
                                <BookmarkCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Bookmark className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            {savedQuestions[question.id]
                              ? "Preferência salva!"
                              : "Salvar visualização atual como preferência"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
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
                  <TabsContent
                    value="bar-view"
                    className="flex-1 overflow-hidden m-0"
                  >
                    <ChartBarDefault
                      data={chartData}
                      textAnswers={textAnswers}
                    />
                  </TabsContent>
                  <TabsContent
                    value="pie-view"
                    className="flex-1 overflow-hidden m-0"
                  >
                    <ChartPieLabel data={chartData} textAnswers={textAnswers} />
                  </TabsContent>
                  <TabsContent
                    value="line-view"
                    className="flex-1 overflow-hidden m-0"
                  >
                    <ChartLineInteractive
                      data={chartData}
                      textAnswers={textAnswers}
                    />
                  </TabsContent>
                  <TabsContent
                    value="radar-view"
                    className="flex-1 overflow-hidden m-0"
                  >
                    <ChartRadar data={chartData} textAnswers={textAnswers} />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
