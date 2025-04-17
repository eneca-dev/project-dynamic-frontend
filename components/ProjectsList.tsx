'use client'

import { useProjects } from '@/hooks/useProjects'
import Link from 'next/link'

export default function ProjectsList() {
  const { projects, loading, error } = useProjects()

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Список проектов</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Список проектов</h2>
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Ошибка: {error.message}
        </div>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Список проектов</h2>
        <p>Нет доступных проектов</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Список проектов</h2>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {project.name || `Проект ID ${project.ws_project_id}`}
                </h3>
                <p className="text-sm text-gray-500">ID: {project.ws_project_id}</p>
                <p className="text-sm text-gray-500">
                  Статус: {project.status || 'active'}
                </p>
              </div>
              <Link 
                href={`/projects/${project.ws_project_id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 