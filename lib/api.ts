import { getProjects as getSupabaseProjects, getProject } from '@/lib/services/projects';
import { getProjectSectionsWithProgress } from '@/lib/services/sections';
import { extractProgressTag } from '@/lib/services/tags';

// Типы данных
export interface Project {
  ws_project_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  manager: string;
  status: string;
}

export interface ProjectWithoutSections {
  ws_project_id: string;
  name: string;
  user_to: Record<string, any> | null;
  status: string;
  id: string;
}

export interface Section {
  id: string;
  name: string;
  progress: number;
  status: string;
  project_id: string;
  tags: Tag[];
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  progress: number;
  section_id: string;
}

// Функции для работы с API

// Получение списка всех проектов
export const fetchProjects = async (): Promise<ProjectWithoutSections[]> => {
  try {
    const projects = await getSupabaseProjects();
    // Преобразуем данные к нужному формату
    return projects.map(project => ({
      ws_project_id: project.ws_project_id.toString(),
      name: project.name || `Проект ${project.ws_project_id}`,
      user_to: project.user_to || null,
      status: project.status || 'active',
      id: project.id
    }));
  } catch (error) {
    console.error('Ошибка при получении списка проектов:', error);
    throw error;
  }
};

// Получение секций с тегами для конкретного проекта
export const fetchProjectSections = async (projectId: string): Promise<any> => {
  try {
    const numericProjectId = parseInt(projectId, 10);
    if (isNaN(numericProjectId)) {
      throw new Error('Некорректный ID проекта');
    }
    
    const projectWithSections = await getProjectSectionsWithProgress(numericProjectId);
    return projectWithSections;
  } catch (error) {
    console.error(`Ошибка при получении секций проекта ${projectId}:`, error);
    throw error;
  }
};

// Адаптер для преобразования данных от Supabase в формат, удобный для фронтенда
export const adaptProjectData = (projects: any[]): Project[] => {
  return projects.map(project => ({
    ws_project_id: project.ws_project_id.toString(),
    name: project.name || `Проект ${project.ws_project_id}`,
    description: '', // У нас может не быть этого поля в Supabase
    start_date: '', // У нас может не быть этого поля в Supabase
    end_date: '', // У нас может не быть этого поля в Supabase
    // Используем поле user_to.name как manager проекта
    manager: project.user_to?.name || 'Не назначен',
    // Дополнительные преобразования, если требуется
    status: project.status || 'active', // Значение по умолчанию, если status отсутствует
  }));
};

// Адаптер для преобразования секций
export const adaptSectionData = (response: any): Section[] => {
  // Если пришел объект с полем sections, извлекаем массив секций
  if (response && typeof response === 'object' && response.sections) {
    const sectionsArray = response.sections;
    if (Array.isArray(sectionsArray)) {
      // Возвращаем преобразованный массив секций с прогрессом из поля tag
      return sectionsArray.map(section => {
        // Извлекаем числовое значение из строки "0%" -> 0
        const progressValue = section.tag ? parseInt(section.tag) : 0;
        
        return {
          id: section.ws_section_id.toString(),
          name: section.name || `Секция ${section.ws_section_id}`,
          progress: progressValue,
          status: 'active', // Значение по умолчанию
          project_id: section.ws_project_id.toString(),
          tags: [], // Пустой массив тегов
          created_at: section.created_at // Сохраняем дату создания секции
        };
      });
    }
  }
  
  // Если sections - уже массив, то обрабатываем его напрямую
  if (Array.isArray(response)) {
    return response.map(section => ({
      ...section,
      progress: section.progress || 0,
      tags: section.tags || [],
    }));
  }
  
  // Если ничего не подошло, возвращаем пустой массив
  console.error('Ошибка формата данных:', response);
  return [];
};

export default {
  fetchProjects,
  fetchProjectSections,
  adaptProjectData,
  adaptSectionData,
}; 