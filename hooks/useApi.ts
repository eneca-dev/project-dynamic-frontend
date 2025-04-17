import { useQuery } from 'react-query';
import {
  fetchProjects,
  fetchProjectSections,
  adaptProjectData,
  adaptSectionData,
  Project,
  Section
} from '@/lib/api';

// Ключи запросов для React Query
export const queryKeys = {
  projects: 'projects',
  projectSections: (projectId: string) => ['projectSections', projectId],
};

// Хук для получения списка проектов
export const useProjects = () => {
  return useQuery(
    queryKeys.projects,
    async () => {
      const projects = await fetchProjects();
      return adaptProjectData(projects);
    },
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false,
    }
  );
};

// Хук для получения секций и тегов конкретного проекта
export const useProjectSections = (projectId: string | undefined) => {
  return useQuery(
    queryKeys.projectSections(projectId || ''),
    async () => {
      if (!projectId) return [];
      const sections = await fetchProjectSections(projectId);
      return adaptSectionData(sections);
    },
    {
      enabled: !!projectId, // Запрос выполняется только если есть projectId
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false,
    }
  );
};

// Вспомогательная функция для фильтрации проектов по менеджеру
export const filterProjectsByManager = (projects: Project[], manager: string | null): Project[] => {
  if (!manager || manager === "Все менеджеры") return projects;
  return projects.filter(project => project.manager === manager);
};

// Вспомогательная функция для расчета общего прогресса проекта на основе секций
export const calculateProjectProgress = (sections: Section[]): number => {
  if (!sections.length) return 0;
  
  // Сумма прогресса всех секций, деленная на количество секций
  const totalProgress = sections.reduce((sum, section) => sum + section.progress, 0);
  return totalProgress / sections.length;
}; 