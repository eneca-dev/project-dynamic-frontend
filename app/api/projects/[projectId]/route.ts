import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/services/projects'

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
    
    const project = await getProject(projectId)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Ошибка при получении проекта:', error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 404 }
    )
  }
} 