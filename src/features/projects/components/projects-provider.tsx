import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import {
  projects as initialProjects,
  type Project,
} from "../data/projects-mock";

interface ProjectLog {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  projectId: string;
  projectTitle: string;
  timestamp: string;
  details?: string;
}

interface ProjectsContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  logs: ProjectLog[];
  addLog: (
    action: ProjectLog["action"],
    projectId: string,
    projectTitle: string,
    details?: string,
    userName?: string,
  ) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined,
);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projectsState, setProjectsState] = useState<Project[]>(() => {
    const saved = localStorage.getItem("local-projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = parsed.map((savedProject: any) => {
          const original = initialProjects.find(
            (p) => p.id === savedProject.id,
          );
          return {
            ...savedProject,
            logo: original?.logo || savedProject.logo,
          };
        });
        return merged;
      } catch {
        return initialProjects;
      }
    }
    return initialProjects;
  });

  const [logs, setLogs] = useState<ProjectLog[]>(() => {
    const savedLogs = localStorage.getItem("project-logs");
    if (savedLogs) {
      try {
        return JSON.parse(savedLogs);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("project-logs", JSON.stringify(logs));
  }, [logs]);

  const addLog = (
    action: ProjectLog["action"],
    projectId: string,
    projectTitle: string,
    details?: string,
    userName?: string,
  ) => {
    const newLog: ProjectLog = {
      id: crypto.randomUUID(),
      userId: "user-001", // TODO: change to actual user ID
      userName: userName || "Usuário Sistema",
      action,
      projectId,
      projectTitle,
      timestamp: new Date().toISOString(),
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
    console.log(`[PROJECT LOG] ${action.toUpperCase()}:`, newLog);
  };

  useEffect(() => {
    const toSave = projectsState.map(({ logo, ...rest }) => rest);
    localStorage.setItem("local-projects", JSON.stringify(toSave));
  }, [projectsState]);

  useEffect(() => {
    const handleProjectsUpdate = () => {
      const saved = localStorage.getItem("local-projects");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const merged = parsed.map((savedProject: any) => {
            const original = initialProjects.find(
              (p) => p.id === savedProject.id,
            );
            return {
              ...savedProject,
              logo: original?.logo || savedProject.logo,
            };
          });
          setProjectsState(merged);
        } catch (error) {
          console.error("Erro ao recarregar projetos:", error);
        }
      }
    };

    window.addEventListener("projects-updated", handleProjectsUpdate);
    return () => {
      window.removeEventListener("projects-updated", handleProjectsUpdate);
    };
  }, []);

  const deleteProject = (id: string) => {
    const project = projectsState.find((p) => p.id === id);
    if (project) {
      const deletionDetails = [
        `Título: "${project.title}"`,
        `Categoria: "${project.category}"`,
        `Responsável: "${project.responsible}"`,
        `Empresa: "${project.company}"`,
        `Orçamento: "${project.budget}"`,
        `Data de Início: "${project.startDate}"`,
        `Data de Término: "${project.endDate}"`,
        `Status: "${project.status}"`,
      ].join("\n");

      addLog("exclusão", id, project.title, deletionDetails, "João Silva");
    }
    setProjectsState((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const project = projectsState.find((p) => p.id === id);
    if (project) {
      const changes: string[] = [];
      if (updates.title && updates.title !== project.title) {
        changes.push(`Título: "${project.title}" → "${updates.title}"`);
      }
      if (updates.description && updates.description !== project.description) {
        changes.push(`Descrição alterada`);
      }
      if (updates.responsible && updates.responsible !== project.responsible) {
        changes.push(
          `Responsável: "${project.responsible}" → "${updates.responsible}"`,
        );
      }
      if (updates.status && updates.status !== project.status) {
        changes.push(`Status: "${project.status}" → "${updates.status}"`);
      }
      if (updates.category && updates.category !== project.category) {
        changes.push(
          `Categoria: "${project.category}" → "${updates.category}"`,
        );
      }
      if (updates.startDate && updates.startDate !== project.startDate) {
        changes.push(
          `Data de Início: "${project.startDate}" → "${updates.startDate}"`,
        );
      }
      if (updates.endDate && updates.endDate !== project.endDate) {
        changes.push(
          `Data de Término: "${project.endDate}" → "${updates.endDate}"`,
        );
      }

      const details = changes.length > 0 ? changes.join("\n") : undefined;
      addLog(
        "edição",
        id,
        updates.title || project.title,
        details,
        "João Silva",
      );
    }
    setProjectsState((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...updates } : project,
      ),
    );
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects: projectsState,
        setProjects: setProjectsState,
        deleteProject,
        updateProject,
        logs,
        addLog,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context)
    throw new Error("useProjects deve ser usado dentro de ProjectsProvider");
  return context;
};
