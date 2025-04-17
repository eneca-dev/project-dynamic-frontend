'use client'

import { useProjectSectionsWithTags } from '@/hooks/useSections'

interface ProjectSectionsProps {
  projectId: number
}

export default function ProjectSections({ projectId }: ProjectSectionsProps) {
  const { data, loading, error } = useProjectSectionsWithTags(projectId)

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Секции проекта</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Секции проекта</h2>
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Ошибка: {error.message}
        </div>
      </div>
    )
  }

  if (!data || !data.sections || data.sections.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Секции проекта</h2>
        <p>У данного проекта нет секций</p>
      </div>
    )
  }

  // Функция для определения цвета прогресса
  const getProgressColor = (tag?: string) => {
    if (!tag) return 'bg-gray-200'
    
    const percentage = parseInt(tag.replace('%', ''))
    
    if (percentage <= 30) return 'bg-red-500'
    if (percentage <= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Секции проекта: {data.project_name || `ID ${data.ws_project_id}`}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {data.sections.map((section) => (
          <div
            key={section.ws_section_id}
            className="border p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {section.name || `Секция ID ${section.ws_section_id}`}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {section.ws_section_id}
                </p>
                <p className="text-sm text-gray-500">
                  Создана: {new Date(section.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <div className={`w-16 h-8 rounded flex items-center justify-center text-white font-bold ${getProgressColor(section.tag)}`}>
                  {section.tag || '0%'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 