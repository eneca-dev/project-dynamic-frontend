import { supabase } from '@/lib/supabase'
import { Project, ProjectWithoutSections } from '@/lib/types'
import { extractProgressTag } from '@/lib/services/tags'
import { getSections } from '@/lib/services/sections'

/**
 * Получение списка всех проектов
 */
export async function getProjects(): Promise<ProjectWithoutSections[]> {
  try {
    // Получаем проекты
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')

    if (projectsError) {
      throw new Error(`Ошибка при получении проектов: ${projectsError.message}`)
    }

    // Получаем все секции
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('sections')
      .select('*')

    if (sectionsError) {
      throw new Error(`Ошибка при получении секций: ${sectionsError.message}`)
    }

    // Собираем проекты с их секциями вручную
    const allProjects = projectsData.map(project => {
      const projectSections = sectionsData.filter(
        section => section.ws_project_id === project.ws_project_id
      )
      return { ...project, sections: projectSections } as Project
    })

    const filteredProjects: ProjectWithoutSections[] = []

    // Фильтруем проекты согласно требованиям
    for (const project of allProjects) {
      let hasNonZeroTag = false

      // Проверяем, есть ли хотя бы одна секция с тегом != 0%
      for (const section of project.sections) {
        const tag = extractProgressTag(section.tags)
        // Если есть тег с прогрессом отличным от 0%, помечаем проект
        if (tag && tag.title !== '0%') {
          hasNonZeroTag = true
          break
        }
      }

      // Добавляем проект если есть секции с тегом != 0%
      if (hasNonZeroTag) {
        const baseProject: ProjectWithoutSections = {
          ws_project_id: project.ws_project_id,
          name: project.name,
          user_to: project.user_to,
          status: project.status,
          id: project.id,
        }
        filteredProjects.push(baseProject)
      }
    }

    return filteredProjects
  } catch (error) {
    console.error('Ошибка при получении проектов:', error)
    throw error
  }
}

/**
 * Получение проекта по ws_project_id
 */
export async function getProject(ws_project_id: number): Promise<Project> {
  try {
    // Получаем проект
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('ws_project_id', ws_project_id)
      .single()

    if (projectError) {
      throw new Error(`Проект с ws_project_id ${ws_project_id} не найден`)
    }

    // Получаем секции проекта
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('ws_project_id', ws_project_id)

    if (sectionsError) {
      throw new Error(`Ошибка при получении секций проекта: ${sectionsError.message}`)
    }

    // Собираем проект с секциями
    return {
      ...projectData,
      sections: sectionsData || []
    } as Project
  } catch (error) {
    console.error(`Ошибка при получении проекта: ${error}`)
    throw error
  }
} 