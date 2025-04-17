import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/services/projects'

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Ошибка при получении проектов:', error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 500 }
    )
  }
} 