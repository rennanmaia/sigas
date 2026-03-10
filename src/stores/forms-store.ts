import { create } from "zustand";

interface FormLog {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  targetFormId: string;
  targetFormTitle: string;
  timestamp: string;
  details?: string;
}

interface FormsStore {
  logs: FormLog[];
  addLog: (
    action: FormLog["action"],
    targetFormId: string,
    targetFormTitle: string,
    details?: string,
    userName?: string,
  ) => void;
}

export const useFormsStore = create<FormsStore>((set) => ({
  logs: (() => {
    const saved = localStorage.getItem("form-logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  })(),

  addLog: (action, targetFormId, targetFormTitle, details, userName) => {
    const newLog: FormLog = {
      id: crypto.randomUUID(),
      userId: "user-001",
      userName: userName || "Usuário Sistema",
      action,
      targetFormId,
      targetFormTitle,
      timestamp: new Date().toISOString(),
      details,
    };
    set((state) => {
      const newLogs = [newLog, ...state.logs];
      localStorage.setItem("form-logs", JSON.stringify(newLogs));
      return { logs: newLogs };
    });
    console.log(`[FORM LOG] ${action.toUpperCase()}:`, newLog);
  },
}));