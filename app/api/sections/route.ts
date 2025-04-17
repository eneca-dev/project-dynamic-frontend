import { NextRequest, NextResponse } from 'next/server'
import { getSections } from '@/lib/services/sections'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const wsProjectId = searchParams.get('ws_project_id')
    
    let projectId: number | undefined = undefined
    if (wsProjectId) {
      projectId = parseInt(wsProjectId)
      if (isNaN(projectId)) {
        return NextResponse.json(
          { detail: 'Некорректный ws_project_id' },
          { status: 400 }
        )
      }
    }
    
    const sections = await getSections(projectId)
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Ошибка при получении секций:', error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 500 }
    )
  }
} 