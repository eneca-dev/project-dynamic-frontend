'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProjects'
import ProjectSections from '@/components/ProjectSections'
import Link from 'next/link'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.projectId as string)
  
  const { project, loading, error } = useProject(projectId)

  if (isNaN(projectId)) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Некорректный ID проекта</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Вернуться к списку проектов
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Загрузка проекта...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ошибка при загрузке проекта</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          {error.message}
        </div>
        <Link href="/" className="text-blue-500 hover:underline">
          Вернуться к списку проектов
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Проект не найден</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Вернуться к списку проектов
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Вернуться к списку проектов
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">
        {project.name || `Проект ID ${project.ws_project_id}`}
      </h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Информация о проекте</h2>
          <p><strong>ID проекта:</strong> {project.ws_project_id}</p>
          <p><strong>Статус:</strong> {project.status || 'active'}</p>
          {project.user_to && (
            <div>
              <p className="mt-2"><strong>Пользователь:</strong></p>
              <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
                {JSON.stringify(project.user_to, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <ProjectSections projectId={project.ws_project_id} />
      </div>
    </div>
  )
} 