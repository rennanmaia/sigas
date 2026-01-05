import { createContext, useContext, useState, type ReactNode } from "react";
import {
  projects as initialProjects,
  type Project,
} from "../data/projects-mock";

interface ProjectsContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
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
