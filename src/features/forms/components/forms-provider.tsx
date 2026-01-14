import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { forms as initialForms, type FormItem } from "../data/forms-mock";

interface FormsContextType {
  forms: FormItem[];
  addForm: (form: any) => void;
  updateForm: (id: string, form: Partial<FormItem>) => void;
  deleteForms: (ids: string[]) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export function FormsProvider({ children }: { children: ReactNode }) {
  const [forms, setForms] = useState<FormItem[]>(initialForms);

  useEffect(() => {
    const saved = localStorage.getItem("local-forms");
    if (saved) {
      setForms(JSON.parse(saved));
    } else {
      setForms(initialForms);
    }
  }, []);

  const addForm = (newFormData: any) => {
    const formToAdd: FormItem = {
      ...newFormData,
      id: `frm-${Math.floor(Math.random() * 10000)}`,
      responses: 0,
      questionsCount: newFormData.questions.length,
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [formToAdd, ...forms];
    setForms(updated);
    localStorage.setItem("local-forms", JSON.stringify(updated));
    alert("Formulário criado com sucesso!");
  };

  const updateForm = (id: string, updatedData: Partial<FormItem>) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedData } : f))
    );
  };

  const deleteForms = (ids: string[]) => {
    setForms((prev) => prev.filter((f) => !ids.includes(f.id)));
  };

  return (
    <FormsContext.Provider value={{ forms, addForm, updateForm, deleteForms }}>
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
