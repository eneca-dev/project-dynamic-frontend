import { NextRequest, NextResponse } from 'next/server'
import { getProjectSectionsWithProgress } from '@/lib/services/sections'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = parseInt(params.projectId)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { detail: 'Некорректный ID проекта' },
        { status: 400 }
      )
    }
    
    const projectSections = await getProjectSectionsWithProgress(projectId)
    return NextResponse.json(projectSections)
  } catch (error) {
    console.error('Ошибка при получении секций проекта с тегами:', error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 404 }
    )
  }
} 