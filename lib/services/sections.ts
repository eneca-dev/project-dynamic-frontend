import { supabase } from '@/lib/supabase'
import { Section, ProjectSectionsResponse, SectionWithTag } from '@/lib/types'
import { extractProgressTag } from '@/lib/services/tags'
import { getProject } from '@/lib/services/projects'

/**
 * Получение списка всех секций с опциональной фильтрацией по ws_project_id
 */
export async function getSections(ws_project_id?: number): Promise<Section[]> {
  try {
    let query = supabase.from('sections').select('*')

    if (ws_project_id !== undefined) {
      query = query.eq('ws_project_id', ws_project_id)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Ошибка при получении секций: ${error.message}`)
    }

    return data as Section[]
  } catch (error) {
    console.error('Ошибка при получении секций:', error)
    throw error
  }
}

/**
 * Получение секций проекта с тегами прогресса
 */
export async function getProjectSectionsWithProgress(
  ws_project_id: number
): Promise<ProjectSectionsResponse> {
  try {
    // Получаем проект
    const project = await getProject(ws_project_id)

    // Получаем все секции проекта
    const sections = await getSections(ws_project_id)

    // Создаем список секций с тегами
    const sectionsWithTags: SectionWithTag[] = sections.map(section => {
      const tag = extractProgressTag(section.tags)
      const tagTitle = tag ? tag.title : null

      return {
        ws_section_id: section.ws_section_id,
        name: section.name,
        ws_project_id: section.ws_project_id,
        created_at: section.created_at,
        tag: tagTitle || undefined,
      }
    })

    return {
      ws_project_id,
      project_name: project.name,
      sections: sectionsWithTags,
    }
  } catch (error) {
    console.error(`Ошибка при получении секций с тегами: ${error}`)
    throw error
  }
} 