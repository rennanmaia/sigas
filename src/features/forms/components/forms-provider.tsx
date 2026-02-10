import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { forms as initialMockForms, type FormItem } from "../data/forms-mock";
import useDialogState from "@/hooks/use-dialog-state";
type FormDialogType = "add" | "edit" | "delete";
interface FormsContextType {
  forms: FormItem[];
  addForm: (form: any) => string;
  updateForm: (id: string, form: Partial<FormItem>) => void;
  deleteForms: (ids: string[]) => void;
  duplicateForm: (id: string) => void;
  open: FormDialogType | null;
  setOpen: (state: FormDialogType | null) => void;
  currentForm: FormItem | null;
  setCurrentForm: React.Dispatch<React.SetStateAction<FormItem | null>>;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export function FormsProvider({ children }: { children: ReactNode }) {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [open, setOpen] = useDialogState<FormDialogType>(null);
  const [currentForm, setCurrentForm] = useState<FormItem | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("local-forms");
    if (saved) {
      try {
        const parsedForms = JSON.parse(saved);
        setForms(parsedForms);
      } catch (error) {
        console.error("Erro ao carregar formulários do localStorage:", error);
        setForms(initialMockForms);
        localStorage.setItem("local-forms", JSON.stringify(initialMockForms));
      }
    } else {
      setForms(initialMockForms);
      localStorage.setItem("local-forms", JSON.stringify(initialMockForms));
    }
  }, []);

  const addForm = (newFormData: any) => {
    const newFormId = `frm-${Math.floor(Math.random() * 10000)}`;
    const formToAdd: FormItem = {
      ...newFormData,
      id: newFormId,
      responses: 0,
      questionsCount: newFormData.questions.length,
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [formToAdd, ...forms];
    setForms(updated);
    localStorage.setItem("local-forms", JSON.stringify(updated));
    return newFormId;
  };

  const updateForm = (id: string, updatedData: Partial<FormItem>) => {
    setForms((prev) => {
      const oldForm = prev.find((f) => f.id === id);
      const oldProjectId = oldForm?.projectId;
      const newProjectId = updatedData.projectId;

      const updated = prev.map((f) =>
        f.id === id
          ? {
              ...f,
              ...updatedData,
              questionsCount: updatedData.questions?.length ?? f.questionsCount,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : f,
      );

      localStorage.setItem("local-forms", JSON.stringify(updated));

      window.dispatchEvent(new Event("forms-updated"));

      if (oldProjectId !== newProjectId) {
        try {
          const savedProjects = localStorage.getItem("local-projects");
          if (savedProjects) {
            const projects = JSON.parse(savedProjects);

            if (oldProjectId) {
              const oldProjectIndex = projects.findIndex(
                (p: any) => p.id === oldProjectId,
              );
              if (oldProjectIndex !== -1 && projects[oldProjectIndex].forms) {
                projects[oldProjectIndex].forms = projects[
                  oldProjectIndex
                ].forms.filter((formId: string) => formId !== id);
              }
            }

            if (newProjectId) {
              const newProjectIndex = projects.findIndex(
                (p: any) => p.id === newProjectId,
              );
              if (newProjectIndex !== -1) {
                if (!projects[newProjectIndex].forms) {
                  projects[newProjectIndex].forms = [];
                }
                if (!projects[newProjectIndex].forms.includes(id)) {
                  projects[newProjectIndex].forms.push(id);
                }
              }
            }

            localStorage.setItem("local-projects", JSON.stringify(projects));
            window.dispatchEvent(new Event("projects-updated"));
          }
        } catch (error) {
          console.error("Erro ao atualizar projetos:", error);
        }
      }

      return updated;
    });
  };

  const deleteForms = (ids: string[]) => {
    setForms((prev) => {
      const updated = prev.filter((f) => !ids.includes(f.id));
      localStorage.setItem("local-forms", JSON.stringify(updated));
      return updated;
    });
  };

  const duplicateForm = (id: string) => {
    const formToDuplicate = forms.find((f) => f.id === id);
    if (!formToDuplicate) return;

    const newFormId = `frm-${Math.floor(Math.random() * 10000)}`;
    const duplicatedForm: FormItem = {
      ...formToDuplicate,
      id: newFormId,
      title: `${formToDuplicate.title} (Cópia)`,
      status: "Rascunho",
      owner: "Carlos Silva", // should be the logged user who has permissions todo it
      projectId: "",
      responses: 0,
      questionsCount: formToDuplicate.questions.length,
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      questions: formToDuplicate.questions,
    };

    const updated = [duplicatedForm, ...forms];
    setForms(updated);
    localStorage.setItem("local-forms", JSON.stringify(updated));
  };

  return (
    <FormsContext.Provider
      value={{
        forms,
        addForm,
        updateForm,
        deleteForms,
        duplicateForm,
        open,
        setOpen,
        currentForm,
        setCurrentForm,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
}

export const useForms = () => {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error("useForms must be used within a FormsProvider");
  }
  return context;
};
