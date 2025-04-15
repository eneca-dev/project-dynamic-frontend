import axios from 'axios';

// Базовый URL бэкенда
// const BASE_URL = 'http://127.0.0.1:8000'; // Замените на нужный URL
const BASE_URL = 'https://project-dynamic-5afcbb796d4b.herokuapp.com/'; // Замените на нужный URL


// Настройка экземпляра axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  user_to: string;
  status: string;
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
    const response = await apiClient.get('/projects/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка проектов:', error);
    throw error;
  }
};

// Получение секций с тегами для конкретного проекта
export const fetchProjectSections = async (projectId: string): Promise<Section[]> => {
  try {
    const response = await apiClient.get(`/tags/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении секций проекта ${projectId}:`, error);
    throw error;
  }
};

// Адаптер для преобразования данных от API в формат, удобный для фронтенда
export const adaptProjectData = (projects: any[]): Project[] => {
  return projects.map(project => ({
    ...project,
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
          name: section.name,
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