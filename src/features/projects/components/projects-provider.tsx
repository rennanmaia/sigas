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

interface ProjectsContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
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
    setProjectsState((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
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
