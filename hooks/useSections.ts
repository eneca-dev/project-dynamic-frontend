import { useState, useEffect } from 'react'
import { Section, ProjectSectionsResponse } from '@/lib/types'

interface SectionsHookResult {
  sections: Section[] | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface ProjectSectionsWithTagsResult {
  data: ProjectSectionsResponse | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Хук для получения списка секций с возможностью фильтрации по проекту
 */
export function useSections(projectId?: number): SectionsHookResult {
  const [sections, setSections] = useState<Section[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSections = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = projectId 
        ? `/api/sections?ws_project_id=${projectId}`
        : '/api/sections'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Ошибка при получении секций')
      }
      
      const data = await response.json()
      setSections(data)
    } catch (err) {
      console.error('Ошибка при получении секций:', err)
      setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [projectId])

  return { sections, loading, error, refetch: fetchSections }
}

/**
 * Хук для получения секций проекта с их тегами прогресса
 */
export function useProjectSectionsWithTags(projectId: number): ProjectSectionsWithTagsResult {
  const [data, setData] = useState<ProjectSectionsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProjectSectionsWithTags = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/tags/project/${projectId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Ошибка при получении секций с тегами')
      }
      
      const responseData = await response.json()
      setData(responseData)
    } catch (err) {
      console.error(`Ошибка при получении секций с тегами для проекта ${projectId}:`, err)
      setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectSectionsWithTags()
  }, [projectId])

  return { data, loading, error, refetch: fetchProjectSectionsWithTags }
} 