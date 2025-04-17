import { useState, useEffect } from 'react'
import { ProjectWithoutSections, Project } from '@/lib/types'

interface ProjectsHookResult {
  projects: ProjectWithoutSections[] | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface ProjectHookResult {
  project: Project | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Хук для получения списка проектов
 */
export function useProjects(): ProjectsHookResult {
  const [projects, setProjects] = useState<ProjectWithoutSections[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Ошибка при получении проектов')
      }
      
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      console.error('Ошибка при получении проектов:', err)
      setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return { projects, loading, error, refetch: fetchProjects }
}

/**
 * Хук для получения информации о конкретном проекте
 */
export function useProject(projectId: number): ProjectHookResult {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${projectId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Ошибка при получении проекта')
      }
      
      const data = await response.json()
      setProject(data)
    } catch (err) {
      console.error(`Ошибка при получении проекта с ID ${projectId}:`, err)
      setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [projectId])

  return { project, loading, error, refetch: fetchProject }
} 