import { createContext, useContext, useState, type ReactNode } from "react";
import {
  projects as initialProjects,
  type Project,
} from "../data/projects-mock";

interface ProjectsContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  deleteProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projectsState, setProjectsState] = useState(initialProjects);

  const deleteProject = (id: string) => {
    const newList = projectsState.filter((p) => p.id !== id);
    setProjectsState(newList);

    initialProjects.length = 0;
    initialProjects.push(...newList);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects: projectsState,
        setProjects: setProjectsState,
        deleteProject,
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
