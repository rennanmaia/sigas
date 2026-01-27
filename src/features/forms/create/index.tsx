import { useNavigate, useSearch } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Save, X } from "lucide-react";
import { useState } from "react";

import { FormsProvider, useForms } from "../components/forms-provider";
import { FormBuilder } from "../components/form-builder";
import { MobilePreviewDialog } from "../components/mobile-preview-dialog";
import type { Question } from "../components/form-builder/types/question";
import { projects as projectsMock } from "@/features/projects/data/projects-mock";

interface FormCreateProps {
  initialId?: string;
}

function CreateFormContent({ initialId }: FormCreateProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { projectId?: string };
  const projectId = search?.projectId;
  const { addForm, updateForm } = useForms();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    questions: Question[];
  }>({
    title: "Formulário sem título",
    description: "",
    questions: [],
  });

  const handleSave = (data: any) => {
    if (initialId) {
      updateForm(initialId, data);
      navigate({ to: "/forms" });
    } else {
      const newFormId = addForm(data);

      if (data.projectId && newFormId) {
        try {
          const projectIndex = projectsMock.findIndex(
            (p) => p.id === data.projectId,
          );
          if (projectIndex !== -1) {
            if (!projectsMock[projectIndex].forms) {
              projectsMock[projectIndex].forms = [];
            }
            if (!projectsMock[projectIndex].forms.includes(newFormId)) {
              projectsMock[projectIndex].forms.push(newFormId);
              projectsMock[projectIndex].stats.formsCount =
                projectsMock[projectIndex].forms.length;
            }
          }

          if (projectId) {
            navigate({
              to: "/projects/$projectId",
              params: { projectId: data.projectId },
            });
            return;
          }
        } catch (error) {
          console.error("Erro ao vincular formulário ao projeto:", error);
        }
      }
      navigate({ to: "/forms" });
    }
  };

  const handlePreview = () => {
    const builderElement = document.querySelector("[data-form-builder]") as any;
    if (builderElement?.__formData) {
      setFormData(builderElement.__formData);
    }
    setPreviewOpen(true);
  };

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-background">
      <Header className="flex-col md:flex-row items-start md:items-center gap-0 h-auto py-3 md:h-16 shrink-0 border-b">
        <div className="flex items-center gap-0 w-full md:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => navigate({ to: "/forms" })}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-semibold truncate">Voltar</h1>
        </div>

        <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            className="md:px-4 h-9"
            onClick={handlePreview}
          >
            <Eye size={16} />
            <span className="hidden md:inline md:ml-2">Visualizar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="md:px-4 h-9"
            onClick={() => navigate({ to: "/forms" })}
          >
            <X size={16} />
            <span className="hidden md:inline md:ml-2">Cancelar</span>
          </Button>

          <Button
            size="sm"
            className="md:px-4 h-9"
            onClick={() => document.getElementById("submit-builder")?.click()}
          >
            <Save size={18} />
            <span className="hidden md:inline md:ml-2">
              {initialId ? "Salvar Alterações" : "Salvar Formulário"}
            </span>
          </Button>
        </div>
      </Header>

      <Main className="p-0 flex-1 overflow-hidden flex flex-col">
        <FormBuilder
          onSave={handleSave}
          initialId={initialId}
          onDataChange={setFormData}
          initialProjectId={projectId}
        />
      </Main>

      <MobilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={formData.title}
        description={formData.description}
        questions={formData.questions}
      />
    </div>
  );
}

export default function FormCreate({ initialId }: FormCreateProps) {
  return (
    <FormsProvider>
      <CreateFormContent initialId={initialId} />
    </FormsProvider>
  );
}
