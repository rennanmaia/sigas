import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Download, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import type { Question } from "./form-builder/types/question";
import type { FormResponse } from "../data/responses-mock";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IndividualResponses } from "./individual-responses";
import { SummaryResponses } from "./summary-responses";
interface ResponsesViewProps {
  formTitle: string;
  questions: Question[];
  responses: FormResponse[];
  onDeleteResponse?: (responseId: string) => void;
  onUpdateResponse?: (
    responseId: string,
    questionId: string,
    newValue: any,
  ) => void;
}

export function ResponsesView({
  formTitle,
  questions,
  responses,
  onDeleteResponse,
  onUpdateResponse,
}: ResponsesViewProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);

  const handleDeleteClick = (responseId: string) => {
    setResponseToDelete(responseId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (responseToDelete && onDeleteResponse) {
      onDeleteResponse(responseToDelete);
    }
    setDeleteDialogOpen(false);
    setResponseToDelete(null);
  };

  const handleAnswerSave = (
    responseId: string,
    questionId: string,
    newValue: any,
  ) => {
    if (onUpdateResponse) {
      onUpdateResponse(responseId, questionId, newValue);
      toast.success("Resposta atualizada", {
        description: "A resposta foi editada e marcada como modificada.",
      });
    }
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
          <SummaryResponses questions={questions} responses={responses} />
        </TabsContent>

        <TabsContent value="individual" className="flex-1 overflow-hidden m-0">
          <IndividualResponses
            questions={questions}
            responses={responses}
            handleDeleteClick={handleDeleteClick}
            handleAnswerSave={handleAnswerSave}
          />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        title="Excluir resposta"
        desc="Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelBtnText="Cancelar"
        destructive
      />
    </div>
  );
}
